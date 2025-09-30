from hashids import Hashids
from django.conf import settings

hashids = Hashids(salt=settings.HASHIDS_SALT, min_length=12)

def encode_id(pk):
    return hashids.encode(pk)

def decode_id(hashid):
    decoded = hashids.decode(hashid)
    if decoded:
        return decoded[0]
    return None
