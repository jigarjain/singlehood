var assert    = require('assert'),
    cfg       = require('../cfg'),
    sh        = require('../core')(cfg);

var setup = function () {
    return new Promise(function (resolve) {
        sh.db.collection('files').drop(function () {
            resolve();
        });
    });
};

var File    = sh.file.File,
    Repo    = sh.file.Repo,
    f       = null;

describe('Repo', function () {
    describe('#add()', function () {
        it('should save file to db and return its id', function () {
            return setup()
                .then(function () {
                    f          = new File();
                    f.source   = 'gdrive';
                    f.userId   = '123';
                    f.fileMeta = {};

                    return Repo.add(f);
                })
                .then(function (id) {
                    assert.ok(id);
                    assert.equal(f._id, id);
                });
        });
    });

    describe('#getById()', function () {
        it('should return a saved file by given id', function () {
            return Repo.getById(f._id)
                .then(function (fetched) {
                    assert.ok(fetched);
                    assert.ok(fetched instanceof File);
                });
        });
    });

    describe('#getByUserId()', function () {
        it('should return a saved file by given userId & source type', function () {
            return Repo.getByUserId(f.userId)
                .then(function (fetched) {
                    assert.ok(fetched);
                    assert.ok(fetched[0].source, 'gdrive');
                });
        });
    });

    describe('#update()', function () {
        it('should update file details', function () {
            f.source = 'dropbox';
            return Repo.update(f)
                .then(assert.ok)
                .then(function () {
                    return Repo.getById(f._id);
                })
                .then(function (fetched) {
                    assert.equal(fetched.source, 'dropbox');
                });
        });
    });

    describe('#delete()', function () {
        it('should delete a file details', function () {
            return Repo.delete(f._id)
                .then(assert.ok)
                .then(function () {
                    return Repo.getById(f._id);
                })
                .then(function (fetched) {
                    assert.ok(!fetched);
                });
        });
    });
});
