const couchbase = require('couchbase');
const uuid4 = require('uuid/v4');

/**
 * Pets datastore backed by couchdb
 */
class PetsStorage {
    /**
     * Construct a new storage connection using consul configs
     * @param {Object} config
     */
    constructor(config) {
        if (config && config.couch) {
            this.init(config);
        }
        
    }

    init({couch}) {
        this.cluster = new couchbase.Cluster(couch.cluster);
        this.cluster.authenticate(couch.username, couch.password);
    }

    deconstruct() {
        this.cluster = null;
        this.bucket = null;
    }

    fetchPet(petId) {
        const bucket = this.cluster.openBucket('lunamals_pets');
        return new Promise((resolve, reject) => {
            bucket.get(petId, (err, {value}) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(value);
            })
        });
    }

    queryPets({owner}) {
        const bucket = this.cluster.openBucket('lunamals_pets');
        const query = `
        SELECT *
          FROM lunamals_pets
          WHERE owner = $owner
        `;
        return new Promise((resolve, reject) => {
            bucket.query(couchbase.N1qlQuery.fromString(query), {owner}, (err, rows, meta) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(rows);
            })
        });
    }

    createPet(petSpec) {
        const id = uuid4();
        const bucket = this.cluster.openBucket('lunamals_pets');
        return new Promise((resolve, reject) => {
            bucket.insert(id, {id, ...petSpec}, (err, _) => {
                if (err) {
                    reject(err);
                    return;
                }
                bucket.get(id, (err, {value}) => {
                    if (err) { reject(err); return; }
                    resolve(value);
                });
            })
        });
    }


}

module.exports = PetsStorage;
