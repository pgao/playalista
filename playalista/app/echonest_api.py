import simplejson
import urllib
import urllib2

from pprint import pprint

API_KEY = 'RRUBJ1MGC491TGXIL'
API_URL = 'http://developer.echonest.com/api/v4'

def query_echonest(request_type, function, parameters):
    if request_type not in ['artist', 'song', 'video']:
        raise Exception('invalid request_type: ' + request_type)
    parameters['api_key'] = API_KEY

    request_url = '/'.join([API_URL, request_type, function])
    request_url += '?' + urllib.urlencode(parameters, True)

    print request_url
    result = None

    attempts = 0
    while attempts < 3:
        try:
            result = simplejson.load(urllib2.urlopen(request_url))
            if result:
                status = result['response']['status']
                if status['code'] != 0:
                    raise Exception('query failed with status ' + status)
            return result['response']
        except Exception as e:
            print "error in querying echonest with url", request_url
            print e
            attempts += 1

    raise Exception('query failed after multiple attempts')


def get_song(search_term):
    parameters = {
        'combined': search_term,
        'bucket': ['tracks', 'audio_summary', 'id:7digital-US']
    }

    response = query_echonest('song', 'search', parameters)
    return response['songs'][0] if response and response['songs'] else None
