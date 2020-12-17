#!/usr/bin/env python

import sys
from pprint import pprint as pp
from optparse import OptionParser
import urllib.request, urllib.error, urllib.parse
import base64
import json

def getItems(url, git_token):

    
    # print(url)
    # base64string = base64.standard_b64encode(('%s:%s' % (git_token, 'x-oauth-basic')).encode()).strip()
    # authheader = "Basic %s" % base64string
    page = 1
    items = []
    try:
        while True:
            request = urllib.request.Request(url + '?per_page=1000&page=%s' % page)
            request.add_header("Authorization", "token %s" % (git_token))
            response = urllib.request.urlopen(request)
            results = [x['name'] for x in json.loads(response.read())]
            if len(results) > 0:
                items += results
                page += 1
            else:
                break
    except Exception as e:
        sys.stderr.write('Unexpected exception: %s \n' % e)
        sys.exit(1)
    items.sort()
    return items

def getBranches(git_token, repo):
    return getItems('https://api.github.com/repos/shotgunsoftware/%s/branches' % repo, git_token)

def getTags(git_token, repo):
    return getItems('https://api.github.com/repos/shotgunsoftware/%s/tags' % repo, git_token)

def getRepos(git_token):
    return getItems('https://api.github.com/orgs/shotgunsoftware/repos', git_token)

def getInfos(git_token, git_type):
    if(git_type.endswith(':branches')):
        res = getBranches(git_token, git_type.split(':')[0])
    elif(git_type.endswith(':tags')):
        res = getTags(git_token, git_type.split(':')[0])
    elif(git_type == 'repos'):
        res = getRepos(git_token)
    else:
        raise Exception('Undefined git type %s. Must be branches or tags' % git_type)
    return res

def main(argv):
    parser = OptionParser(usage='usage: %prog [options] [<repo>:branches|<repo>:tags|repos]')
    parser.add_option('-t', '--git-token',
        help='API key')
    (options, args) = parser.parse_args()

    if None in list(vars(options).values()):
        print("Missing required option for Shotgun API connection.")
        parser.print_help()
        sys.exit(2)

    if len(args) != 1:
        parser.error("incorrect number of arguments")
        parser.print_help()
        sys.exit(2)

    try:
        pp(getInfos(options.git_token, args[0]))
    except Exception as e:
        parser.error('Unexpected exception: %s \n' % e)
        parser.print_help()
        sys.exit(2)

if __name__ == "__main__":
    main(sys.argv[1:])
