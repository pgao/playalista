var ECHONEST_API_KEY = 'RRUBJ1MGC491TGXIL';
var ECHONEST_API_URL = 'http://developer.echonest.com/api/v4';

var YOUTUBE_API_KEY = 'AIzaSyCiERdaxIuw6WOxFFB1joOu1XBEuuCO2dg';
var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

var DEFAULT_SONGS = [
    'Epistrophy - Thelonious Monk',
    'Blitzkrieg Bop - The Ramones',
    'Derezzed (Remixed By The Glitch Mob) - Daft Punk'
]

var playalista = angular.module('playalista', ['autocomplete', 'youtube']);

playalista.controller('musicCtrl', function($scope, $http) {
    $scope.queryEchonest = function(requestType, requestFunction, parameters, callback) {
        if (!requestType in ['artist', 'song', 'playlist']) {
            throw exception;
        }
        parameters['api_key'] = ECHONEST_API_KEY;

        var requestUrl = [ECHONEST_API_URL, requestType, requestFunction].join('/');

        var paramKeys = Object.keys(parameters);
        var paramStrings = [];

        for (key in parameters) {
            if (parameters[key] instanceof Array) {
                for (var j = 0; j < parameters[key].length; j++) {
                        paramStrings = paramStrings.concat(encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key][j]));
                }
            }
            else {
                paramStrings = paramStrings.concat(encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key]));
            }
        }

        requestUrl = requestUrl.concat('?', paramStrings.join('&'));

        $http.get(requestUrl).success(callback).error(function() {
            console.log("echonest query failed in queryEchonest");
        });
    };

    $scope.getSong = function(searchTerm) {
        parameters = {
            'combined': searchTerm,
            'bucket': ['tracks', 'audio_summary', 'id:7digital-US'],
            'rank_type': 'relevance',
        };

        console.log("query: " + searchTerm);

        if (searchTerm) {
            $scope.queryEchonest('song', 'search', parameters, function(data, status, headers, config) {
                $scope.songs = [];
                for (var i = 0; i < data.response.songs.length; i++) {
                    var song = data.response.songs[i];
                    var entry = song.title + ' - ' + song.artist_name;
                    if ($scope.songs.indexOf(entry) == -1) {
                        $scope.songs.push(entry);
                    }
                }
            });
        }
    };

    $scope.getRelatedSong = function(songId) {
        parameters = {
            'song_id': songId,
            'format': 'json',
            'results': '20',
            'type': 'song-radio',
        };

        if (searchTerm) {
            // $scope.queryEchonest('playlist', 'static', parameters, function(data, status, headers, config) {
            //     debugger;
            // });
            console.log('getting related song');
        }
    };

    $scope.getVideo = function(searchTerm) {
        var requestUrl = YOUTUBE_API_URL + "?part=id&q=" + encodeURIComponent(searchTerm) + '&order=relevance&type=video&key=' + YOUTUBE_API_KEY;
        $http.get(requestUrl).success(function(data, status, headers, config) {
            $scope.code = data.items[0].id.videoId;
            $scope.getNextVideo();
        }).error(function() {
            console.log("echonest query failed in getVideo");
        });
    };

    $scope.getNextVideo = function() {
        var requestUrl = YOUTUBE_API_URL + "?part=id&relatedToVideoId=" + $scope.code + '&order=relevance&type=video&key=' + YOUTUBE_API_KEY;
        $http.get(requestUrl).success(function(data, status, headers, config) {
            $scope.next = data.items[Math.floor(Math.random() * data.items.length)].id.videoId;
        }).error(function() {
            console.log("echonest query failed in getVideo");
        });
    };

    $scope.onStateChange = function(state) {
        if (state.data == 0) {
            $scope.code = $scope.next;
            $scope.getNextVideo();
        }
    };

    $scope.selected = DEFAULT_SONGS[Math.floor(Math.random() * DEFAULT_SONGS.length)];

    $scope.code = $scope.getVideo($scope.selected);

    $scope.next = '';

    $scope.suggestions = [];
});
