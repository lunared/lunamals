#!/usr/bin/env python3
"""
Utility that'll iterate through migrations of a service
and execute them against couchbase
"""

from couchbase.cluster import Cluster, PasswordAuthenticator
from couchbase.admin import Admin as CouchbaseAdmin
import couchbase.exceptions
import os
import argparse
import importlib.util
from datetime import datetime

parser = argparse.ArgumentParser()
parser.add_argument('service')
args = parser.parse_args()

service_name = args.service
MIGRATIONS_BUCKET_NAME = f"lunamals_migrations"

cluster = Cluster("couchbase://localhost")
cluster.authenticate(PasswordAuthenticator(
    'Administrator',
    'lunamals'
))

admin = CouchbaseAdmin('Administrator', 'lunamals')

# create bucket for migrations tracking if it doesn't already exist
try:
    admin.bucket_create(
        MIGRATIONS_BUCKET_NAME,
        ram_quota=128
    )
    admin.wait_ready(MIGRATIONS_BUCKET_NAME, timeout=30)
except couchbase.exceptions.HTTPError as err:
    if err.objextra.http_status == 400:
        pass
    else:
        sys.exit(-1)

import sys
sys.path.insert(0, f"{service_name}/etc/")
from migrations import *
import migrations

# iterate through migrations
migrations_bucket = cluster.open_bucket(MIGRATIONS_BUCKET_NAME)
for mod in migrations.__all__:
    migration = importlib.import_module('migrations.' + mod)
    migration_key = f"{service_name}:{mod}"
    # make sure the migration isn't already installed
    try:
        migrations_bucket.get(migration_key)
        print(f"{mod} already installed")
        continue
    except couchbase.exceptions.NotFoundError:
        pass
    
    migration.migrate(cluster, admin)

    # record migration as having been installed
    migrations_bucket.insert(migration_key, datetime.now().isoformat())
    print(f"{mod} installed")
