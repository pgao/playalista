var ECHONEST_API_KEY = 'RRUBJ1MGC491TGXIL';
var ECHONEST_API_URL = 'http://developer.echonest.com/api/v4';

var YOUTUBE_API_KEY = 'AIzaSyCiERdaxIuw6WOxFFB1joOu1XBEuuCO2dg';
var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

var playalista = angular.module('playalista', ['autocomplete']);

playalista.controller('musicCtrl', function($scope, $http) {
        $scope.queryEchonest = function(requestType, requestFunction, parameters, callback) {
                if (!requestType in ['artist', 'song']) {
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

                console.log(requestUrl);

                $http.get(requestUrl).success(callback).error(function() {
                    console.log("echonest query failed in queryEchonest");
                });
        };

        $scope.getSong = function(searchTerm) {
                parameters = {
                        'combined': searchTerm,
                        'bucket': ['tracks', 'audio_summary', 'id:7digital-US'],
                };

                console.log("query: " + searchTerm);

                if (searchTerm) {
                    $scope.queryEchonest('song', 'search', parameters, function(data, status, headers, config) {
                            console.log(data);
                            // $scope.getVideo(data.response.songs[0].title + ' ' + data.response.songs[0].artist_name);
                            $scope.songs = [];
                            for (var i = 0; i < data.response.songs.length; i++) {
                                var song = data.response.songs[i];
                                var entry = song.title + ' - ' + song.artist_name;
                                if ($scope.songs.indexOf(entry) == -1) {
                                    $scope.songs.push(entry);
                                }
                            }
                            console.log("scope.songs: " + $scope.songs);
                    });
                }
        };

        $scope.getVideo = function(searchTerm) {
                console.log("getVideo. searchTerm:");
                var requestUrl = YOUTUBE_API_URL + "?part=id&q=" + encodeURIComponent(searchTerm) + '&order=viewCount&key=' + YOUTUBE_API_KEY;
                $http.get(requestUrl).success(function(data, status, headers, config) {
                        console.log(data);
                        $scope.code = data.items[0].id.videoId;
                }).error(function() {
                        console.log("echonest query failed in getVideo");
                });
        };

        $scope.code = "dZ9El7k4mNo";

        $scope.songs = [];
});

playalista.directive('youtube', function($sce) {
    return {
        restrict: 'EA',
        scope: { code:'=' },
        replace: true,
        template: '<div style="height:600px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
        link: function (scope) {
            scope.$watch('code', function (newVal) {
                if (newVal) {
                    scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal + "?autoplay=1&wmode=transparent");
                }
            });
        }
    };
});
