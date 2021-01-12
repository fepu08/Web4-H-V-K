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

        // add team to user's profile
        profile.teams.unshift({team_id: team.id, name: team.name});
        await profile.save();

        return res.status(200).send(team.members);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
