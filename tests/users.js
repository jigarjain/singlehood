var assert    = require('assert'),
    cfg       = require('../cfg'),
    sh        = require('../core')(cfg);

var setup = function () {
    return new Promise(function (resolve) {
        sh.db.collection('users').drop(function () {
            resolve();
        });
    });
};

var User    = sh.users.User,
    Repo    = sh.users.Repo,
    u       = null;

describe('Repo', function () {
    describe('#add()', function () {
        it('should save user to db and return its id', function () {
            return setup()
                .then(function () {
                    u = new User();
                    u.fname = 'John';
                    u.lname = 'Doe';
                    u.email = 'jd@email.com';

                    return Repo.add(u);
                })
                .then(function (id) {
                    assert.ok(id);
                    assert.equal(u._id, id);
                });
        });
    });

    describe('#add()', function () {
        it('should not save a user with the same email again', function () {
            return Repo.add(u)
                .then(function () {
                    assert.ok(false);
                }, function (err) {
                    assert(err);
                });
        });
    });

    describe('#getById()', function () {
        it('should return a saved user by given id', function () {
            return Repo.getById(u._id)
                .then(function (fetched) {
                    assert.ok(fetched);
                    assert.ok(fetched instanceof User);
                });
        });
    });

    describe('#getByEmail()', function () {
        it('should return a saved user by given email', function () {
            return Repo.getByEmail(u.email)
                .then(function (fetched) {
                    assert.ok(fetched);
                    assert.ok(fetched instanceof User);
                    assert.ok(fetched.email, u.email);
                });
        });
    });

    describe('#update()', function () {
        it('should update user details', function () {
            u.fname = 'updated user!';
            return Repo.update(u)
                .then(assert.ok)
                .then(function () {
                    return Repo.getByEmail(u.email);
                })
                .then(function (fetched) {
                    assert.equal(fetched.fname, 'updated user!');
                });
        });
    });
});
