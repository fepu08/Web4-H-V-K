const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Team = require('../../models/Team')
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try{
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate('user', ['first_name', 'last_name', 'avatar']);

        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'});
        }

        res.json(profile);
    } catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   POST api/profile/
// @desc    Create or update users profile
// @access  Private
router.post('/',
    [
        auth,
        // if you have required fields you should check them here
        //like
        // check('name', 'Name is required').not().isEmpty()
        check('skills', 'Skills are required').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {
            address,
            city,
            country,
            skills,
            githubusername,
            youtube,
            twitter,
            facebook,
            linkedin,
            instagram,
            teams
        } = req.body;

        // Build profile object
        const profileFields =  {};
        profileFields.user = req.user.id;
        if(skills) profileFields.skills = skills.split(',').map(skill => skill.trim());
        if(githubusername) profileFields.githubusername = githubusername;

        profileFields.location = {};
        if(address) profileFields.location.address = address;
        if(city) profileFields.location.city = city;
        if(country) profileFields.location.country = country;

        const socialFields = {youtube, twitter, facebook, linkedin, instagram};
        // normalize social fields to ensure valid url
        for (const [key, value] of Object.entries(socialFields)) {
            if (value && value.length > 0)
                socialFields[key] = normalize(value, {forceHttps: true});
        }
        profileFields.social = socialFields;

        if(teams) {
            profileFields.teams = teams.split(',').map(team => team.trim());
        }

        try {
            //check teams are exist
            if(teams) {
                let badTeams = [];
                for (const team of profileFields.teams) {
                    let actual = await Team.findOne({name: team}).exec();
                    if (!actual) badTeams.push(team);
                }
                if (badTeams.length > 0) {
                    return res.status(400).json({errors: [{msg: "Teams do not exist with name: " + badTeams}]});
                }
            }

            // Check Github Username Taken
            if(profileFields.githubusername){
                let user = await User.findOne({ githubusername: profileFields.githubusername });
                if(user) return res.status(400).json({ errors: [{ msg: 'User already exists with this github username' }] });
            }

            // Check profile exists
            let profile = await Profile.findOne({user: req.user.id});
            if(profile){
                // Update
                profile = await Profile.findOneAndUpdate(
                    {user: req.user.id},
                    {$set: profileFields},
                    {new: true, upsert: true, setDefaultsOnInsert: true}
                );
            } else {
                // Create
                profile = new Profile(profileFields);
            }
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    });

module.exports = router;