const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Team = require('../../models/Team');
const User = require('../../models/User');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const { check, validationResult } = require('express-validator');

router.get('/', auth, async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

router.get('/:team_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        if(!team) return res.status(400).json({ msg: 'Team not found'});
        res.json(team);
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.post('/',
    [
        auth,
        [
            check('name', 'Name is required').not().isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        try {
            const owner = await User.findById(req.user.id).select('-password');
            const ownerProfile = await Profile.findOne({user: req.user.id});
            let team = await Team.findOne({name: req.body.name});
            if(team){
                return res.status(400).json({ errors: [{ msg: 'Team already exists with this name' }] });
            }
            team = new Team({
                name: req.body.name,
                owners: {user: owner.id},
                admins: {user: owner.id},
                members: {user: owner.id}
            });
            await team.save();
            ownerProfile.teams.unshift({team_id: team.id, name: req.body.name});
            await ownerProfile.save();
            res.json(team.id);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

router.delete('/:team_id', auth, async (req, res) => {
        try {
            const team = await Team.findById(req.params.team_id);
            if(!team){
                return res.status(400).json({ error: { msg: 'Team does not exist with this ID' } });
            }

            if (!isOwner(req, team)) {
                return res.status(400).json({error: {msg: 'Only one of the team owners can delete the team'}});
            }
            
            const posts = await Post.deleteMany({team: req.params.team_id});

            await team.remove();
            res.json({msg: 'Team removed'});
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

router.put('/posts/add/:team_id/:post_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const post = await Post.findById(req.params.post_id);

        if(!team) {
            return res.status(404).json({msg: "Team not found"});
        }
        if(!post) {
            return res.status(404).json({msg: "Post not found"});
        }

        const checkResult = canUserAddThisPost(req, team, post)
        if(checkResult) {
            return res.status(400).send(checkResult);
        }

        team.posts.unshift({post: req.params.post_id});
        post.team = req.params.team_id;
        await post.save();
        await team.save();

        res.json(team.posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/posts/remove/:team_id/:post_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const post = await Post.findById(req.params.post_id);

        const checkResult = canUserDeleteThisPost(req, team, post);
        if(checkResult) {
            return res.status(400).send(checkResult);
        }

        const removeIndex = team.posts.map(post => post.post.toString()).indexOf(post.id);
        team.posts.splice(removeIndex, 1);
        await Post.findByIdAndDelete(req.params.post_id);
        await team.save();
        res.json(team.posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/member/add/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);
        const profile = await Profile.findOne({user: req.params.user_id});

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }
        if(!profile) {
            return res.status(404).json({msg: "This user has no profile"});
        }


        if(!isLoggedInUserAdmin(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }

        if(isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User is already member"});
        }

        team.members.push({user: user.id});
        await team.save();

        
        profile.teams.unshift({team_id: team.id, name: team.name});
        await profile.save();

        return res.status(200).send(team.members);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/members/remove/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);
        const profile = await Profile.findOne({user: req.params.user_id});

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }
        if(!profile) {
            return res.status(404).json({msg: "This user has no profile"});
        }

        if(isUserOwner(team, user) && !isLoggedInUserOwner(req, team)){
            return res.status(403).json({msg: "Access denied"});
        }

        const loggedInIsAdmin = isLoggedInUserAdmin(req, team);
        if(!loggedInIsAdmin && user.id !== req.user.id) {
            return res.status(403).json({msg: "Access denied"});
        }

        if(!isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User is not member of this team"});
        }

        
        let removeIndex = team.members.map(member => member.id).indexOf(user.id);
        team.members.splice(removeIndex, 1);
        await team.save();

        
        removeIndex = profile.teams.map(team => team.team_id).indexOf(team.id);
        profile.teams.splice(removeIndex, 1);
        await profile.save();

        if(loggedInIsAdmin) {
            return res.status(200).json(team.members);
        }
        return res.status(200).send("User Removed Successfully");
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/members/:team_id/user_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const user = await User.findById(req.params.user_id).select('-password');

        if(!team) return res.status(404).json({ msg: 'Team not found'});
        if(!user) return res.status(404).json({ msg: 'User not found'});

        if(!isUserTeamMember(team, user)) return res.status(404).json({msg: 'User is not team member'});

        res.status(200).json({member: user});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.get('/members/:team_id/', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);

        if(!team) return res.status(404).json({ msg: 'Team not found'});

        const members = [];
        for(let i = 0; i < team.members.length; i++){
            const user = await User.findById(team.members[i].user).select('-password');
            
            if(user) {
                const profile = await Profile.findOne({user: user.id.toString()});
                if(!profile) return res.status(404).json({ msg: 'Profile not found'});
                members.push(profile);
            }
        }

        res.status(200).json({members: members});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.put('/admins/add/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }

        if(!isLoggedInUserAdmin(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User must be a team member first!"});
        }
        if(isUserAdmin(team, user)){
            return res.status(400).json({msg: "User is already admin."});
        }

        team.admins.push({user: user.id});
        await team.save();
        return res.status(200).send(team.admins);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/admins/remove/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }

        if(isUserOwner(team, user) && !isLoggedInUserOwner(req, team)){
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isLoggedInUserAdmin(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isUserAdmin(team, user)){
            return res.status(400).json({msg: "User is not admin"});
        }

        
        let removeIndex = team.admins.map(admin => admin.id).indexOf(user.id);
        team.admins.splice(removeIndex, 1);
        await team.save();
        return res.status(200).json(team.admins);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/admins/:team_id/:user_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const user = await User.findById(req.params.user_id).select('-password');

        if(!team) return res.status(404).json({ msg: 'Team not found'});
        if(!user) return res.status(404).json({ msg: 'User not found'});

        if(!isUserTeamMember(team, user)) return res.status(404).json({msg: 'User is not team member'});
        if(!isUserAdmin(team, user)) return res.status(404).json({msg: 'User is not admin'});

        res.status(200).json({admin: user});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.get('/admins/:team_id/', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);

        if(!team) return res.status(404).json({ msg: 'Team not found'});

        const admins = [];
        for(let i = 0; i < team.admins.length; i++){
            const user = await User.findById(team.admins[i].user).select('-password');
            
            if(user) {
                const profile = await Profile.findOne({user: user.id.toString()});
                if(!profile) return res.status(404).json({ msg: 'Profile not found'});
                admins.push(profile);
            }
        }

        res.status(200).json({admins: admins});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.put('/owners/add/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }

        if(!isLoggedInUserOwner(req, team)) {
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isUserTeamMember(team, user)){
            return res.status(400).json({msg: "User must be a team member first!"});
        }
        if(isUserOwner(team, user)){
            return res.status(400).json({msg: "User is already owner."});
        }

        team.owners.push({user: user.id});
        await team.save();
        return res.status(200).send(team.owners);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/owners/remove/:team_id/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).select('-password');
        const team = await Team.findById(req.params.team_id);

        if(!user) {
            return res.status(404).json({msg: "User does not exist with this ID"});
        }
        if(!team) {
            return res.status(404).json({msg: "Team does not exist with this ID"});
        }

        if(isUserOwner(team, user) && !isLoggedInUserOwner(req, team)){
            return res.status(403).json({msg: "Access denied"});
        }
        if(!isUserOwner(team, user)){
            return res.status(400).json({msg: "User is not owner"});
        }

        let removeIndex = team.owners.map(owner => owner.id).indexOf(user.id);
        team.owners.splice(removeIndex, 1);
        await team.save();
        return res.status(200).json(team.owners);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/owners/:team_id/:user_id', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);
        const user = await User.findById(req.params.user_id).select('-password');

        if(!team) return res.status(404).json({ msg: 'Team not found'});
        if(!user) return res.status(404).json({ msg: 'User not found'});

        if(!isUserTeamMember(team, user)) return res.status(404).json({msg: 'User is not team member'});
        if(!isUserOwner(team, user)) return res.status(404).json({msg: 'User is not owner'});

        res.status(200).json({owner: user});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

router.get('/owners/:team_id/', auth, async (req, res) => {
    try {
        const team = await Team.findById(req.params.team_id);

        if(!team) return res.status(404).json({ msg: 'Team not found'});

        const owners = [];
        for(let i = 0; i < team.owners.length; i++){
            const user = await User.findById(team.owners[i].user).select('-password');
            
            if(user) {
                const profile = await Profile.findOne({user: user.id.toString()});
                if(!profile) return res.status(404).json({ msg: 'Profile not found'});
                owners.push(profile);
            }
        }

        res.status(200).json({owners: owners});
    } catch (err) {
        console.error(err.message);
        if(err.kind === 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found'});
        }
        res.status(500).send('Server Error');
    }
})

function canUserAddThisPost(req, team, post){
    if (!isLoggedInUserTeamMember(req,team)) return "This user is not a member of this team.";
    if (postIsAlreadyAdded(req, team)) return "Post is already added to this team";
    if(!(isLoggedInUserAdmin(req, team)) && !(postFromLoggedInUser(req, post))){
        return "To add this post, you should be admin and/or the author of the post";
    }
}

function canUserDeleteThisPost(req, team, post) {
    if (!isLoggedInUserTeamMember(req,team)) return "This user is not a member of this team.";
    if (!postIsAlreadyAdded(req, team)) return "Post not found with this ID";
    if(!(isLoggedInUserAdmin(req, team)) && !(postFromLoggedInUser(req, post))){
        return "To remove this post, you should be admin and/or the author of the post";
    }
}

function postIsAlreadyAdded(req, team) {
    return team.posts.filter(post => post.post.toString() === req.params.post_id).length > 0;
}

function isLoggedInUserAdmin(req, team){
    return team.admins.filter(admin => admin.user.toString() === req.user.id).length > 0;
}

function isUserAdmin(team, user){
    return team.admins.filter(admin => admin.user.toString() === user.id).length > 0;
}

function isUserOwner(team, user) {
    return team.owners.filter(owner => owner.user.toString() === user.id).length > 0;
}

function postFromLoggedInUser(req, post){
    return post.user.id === req.user.id;
}

function isLoggedInUserTeamMember(req, team){
    return team.members.filter(member => member.user.toString() === req.user.id).length > 0;
}

function isLoggedInUserOwner(req, team) {
    return team.owners.filter(owner => owner.user.toString() === req.user.id).length > 0;
}

function isUserTeamMember(team, user) {
    return team.members.filter(member => member.user.toString() === user.id).length > 0;
}

function isOwner(req, team){
    return team.owners.filter(owner => owner.user.toString() === req.user.id).length > 0;
}

module.exports = router;
