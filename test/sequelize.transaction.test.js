var chai        = require('chai')
  , expect      = chai.expect
  , Support     = require(__dirname + '/support')
  , Promise     = require(__dirname + '/../lib/promise')
  , Transaction = require(__dirname + '/../lib/transaction')

describe(Support.getTestDialectTeaser("Sequelize#transaction"), function () {
  this.timeout(4000);

  describe('success', function() {
    it("gets triggered once a transaction has been successfully committed", function(done) {
      this
        .sequelize
        .transaction().then(function(t) { t.commit(); })
        .success(function() { done(); });
    });

    it("gets triggered once a transaction has been successfully rollbacked", function(done) {
      this
        .sequelize
        .transaction().then(function(t) { t.rollback(); })
        .success(function() { done(); });
    });

    if (Support.getTestDialect() !== 'sqlite') {
      it('works for long running transactions', function(done) {
        Support.prepareTransactionTest(this.sequelize, function(sequelize) {
          var User = sequelize.define('User', {
            name: Support.Sequelize.STRING
          }, { timestamps: false });

          return sequelize.sync({ force: true }).success(function() {
            return sequelize.transaction();
          }).then(function (t) {
            expect(t).to.be.ok;
            var query = 'select sleep(2);';

            switch(Support.getTestDialect()) {
            case 'postgres':
              query = 'select pg_sleep(2);';
              break;
            case 'sqlite':
              query = 'select sqlite3_sleep(2000);';
              break;
            default:
              break;
            }

            return sequelize.query(query, null, {
              raw: true,
              plain: true,
              transaction: t
            }).then(function() {
              var dao = User.build({ name: 'foo' });

              // this.QueryGenerator.insertQuery(tableName, values, dao.daoFactory.rawAttributes)
              return query = sequelize
                .getQueryInterface()
                .QueryGenerator
                .insertQuery(User.tableName, dao.values, User.rawAttributes);
            }).then(function () {
              return Promise.delay(1000);
            }).then(function () {
              return sequelize.query(query, null, {
                raw: true,
                plain: true,
                transaction: t
              });
            }).then(function () {
              return t.commit();
            });
          }).then(function() {
            return User.all().success(function(users) {
              expect(users.length).to.equal(1);
              expect(users[0].name).to.equal('foo');
              done();
            });
          }).catch(done);
        });
      });
    }
  });

  describe('error', function() {
    if (Support.getTestDialect() === 'sqlite') {
      // not sure if we can test this in sqlite ...
      // how could we enforce an authentication error in sqlite?
    } else {
      it("gets triggered once an error occurs", function(done) {
        var sequelize = Support.createSequelizeInstance();

        // lets overwrite the host to get an error
        sequelize.config.username = 'foobarbaz';

        sequelize
          .transaction().then(function() {})
          .catch(function(err) {
            expect(err).to.not.be.undefined;
            done();
          });
      });
    }
  });

  describe('complex long running example', function() {
    it("works with promise syntax", function(done) {
      Support.prepareTransactionTest(this.sequelize, function(sequelize) {
        var Test = sequelize.define('Test', {
          id:   { type: Support.Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
          name: { type: Support.Sequelize.STRING }
        })

        sequelize
          .sync({ force: true })
          .then(function() {
            sequelize.transaction().then(function(transaction) {
              expect(transaction).to.be.instanceOf(Transaction);

              Test
                .create({ name: 'Peter' }, { transaction: transaction })
                .then(function() {
                  setTimeout(function() {
                    transaction
                      .commit()
                      .then(function() { return Test.count() })
                      .then(function(count) {
                        expect(count).to.equal(1)
                        done()
                      })
                  }, 1000)
                })
            })
          })
      })
    })
  })

  describe('concurrency', function() {
    describe('having tables with uniqueness constraints', function() {
      beforeEach(function(done) {
        var self = this

        Support.prepareTransactionTest(this.sequelize, function(sequelize) {
          self.sequelize = sequelize

          self.Model = sequelize.define('Model', {
            name: { type: Support.Sequelize.STRING, unique: true }
          }, {
            timestamps: false
          })

          self.Model
            .sync({ force: true })
            .success(function() { done() })
        })
      })

      it("triggers the error event for the second transactions", function(done) {
        var self = this

        this.sequelize.transaction().then(function(t1) {
          self.sequelize.transaction().then(function(t2) {
            self
              .Model
              .create({ name: 'omnom' }, { transaction: t1 })
              .success(function(m1) {
                self
                  .Model
                  .create({ name: 'omnom' }, { transaction: t2 })
                  .error(function(err) {
                    t2.rollback().success(function() {
                      expect(err).to.be.defined
                      done()
                    })
                  })

                setTimeout(function() { t1.commit() }, 100)
              })
          })
        })
      })
    })
  })
})
