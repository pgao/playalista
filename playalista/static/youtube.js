var app = angular.module('youtube', []);

app.run(function () {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

});

app.directive('youtube', ['$window', function($window, $sce) {

    return {
        restrict: 'EA',
        scope: {
            code: '=',
            onStateChange: "="
        },
        replace: true,
        template: '<div style="height:600px;" id="player"></div>',
        link: function (scope) {
            var player;
            scope.$watch('code', function (newVal) {
                if (newVal) {
                    if (!player) {
                        player = new YT.Player('player', {
                            height: '100%',
                            width: '100%',
                            videoId: 'M71c1UVf-VE',
                            playerVars: {
                                wmode: "transparent",
                                autoplay: "1",
                            },
                            events: {
                                'onReady': function() {
                                    player.loadVideoById(newVal);
                                },
                                'onStateChange': onStateChange,
                            }
                        })
                    }
                    else {
                        player.loadVideoById(newVal);
                    }
                }
            });

            function onStateChange(state) {
                scope.onStateChange(state);
            }
        }
    };
}]);
