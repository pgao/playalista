var ECHONEST_API_KEY = 'RRUBJ1MGC491TGXIL';
var ECHONEST_API_URL = 'http://developer.echonest.com/api/v4';

var YOUTUBE_API_KEY = 'AIzaSyCiERdaxIuw6WOxFFB1joOu1XBEuuCO2dg';
var YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/search'

var playalista = angular.module('playalista', ['autocomplete']);

playalista.controller('musicCtrl', function($scope, $http) {
        $scope.queryEchonest = function(request_type, request_function, parameters, callback) {
                if (!request_type in ['artist', 'song']) {
                        throw exception;
                }
                parameters['api_key'] = ECHONEST_API_KEY;

                var requestUrl = [ECHONEST_API_URL, request_type, request_function].join('/');

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
                        alert("echonest query failed");
                });
        };

        $scope.getSong = function(search_term) {
                parameters = {
                        'combined': search_term,
                        'bucket': ['tracks', 'audio_summary', 'id:7digital-US'],
                };

                console.log("query: " + search_term);

                $scope.queryEchonest('song', 'search', parameters, function(data, status, headers, config) {
                        console.log(data);
                        // $scope.getVideo(data.response.songs[0].title + ' ' + data.response.songs[0].artist_name);
                        $scope.songs = [];
                        for (var i = 0; i < data.response.songs.length; i++) {
                            $scope.songs.push(data.response.songs[i].title + ' - ' + data.response.songs[i].artist_name);
                        }
                        console.log("scope.songs: " + $scope.songs);
                });
        };

        $scope.getVideo = function(search_term) {
                var requestUrl = YOUTUBE_API_URL + "?part=id&q=" + encodeURIComponent(search_term) + '&key=' + YOUTUBE_API_KEY;
                $http.get(requestUrl).success(function(data, status, headers, config) {
                        console.log(data);
                        $scope.code = data.items[0].id.videoId;
                }).error(function() {
                        alert("echonest query failed");
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
                    scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal + "?autoplay=1");
                }
            });
        }
    };
});
