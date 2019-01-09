const auth = require('../../../middleware/auth');
const {User} = require('../../../models/user');
const mongoose = require('mongoose');

describe('auth middle', () => {
    it('should populate user.name with paylod of a valid jwt', () => {

        const user ={
            _id : mongoose.Types.ObjectId().toHexString(),
            isAdmin : true
        }

        const token = new User(user).generateAuthToken();
        const req = {
            header : jest.fn('').mockReturnValue(token)
        }
        const res = {};
        const next = jest.fn();


        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});
