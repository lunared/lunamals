BUCKET_NAME='lunamals_pets'

def migrate(cluster, admin):
    admin.bucket_create(
        BUCKET_NAME,
        ram_quota=128
    )
    admin.wait_ready(BUCKET_NAME, timeout=30)

    cb = cluster.open_bucket(BUCKET_NAME)
    cb.bucket_manager().create_n1ql_index('index__pets_by_owner', fields=['owner'])
