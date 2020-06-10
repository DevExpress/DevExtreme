$(function(){
    $("#popup").dxPopup({
        width: 550,
        height: 350,
        visible: true,
        showTitle: false,
        closeOnOutsideClick: false,
        contentTemplate: function (container) {
            var scrollView = $('<div />');

            scrollView.append($('<img />', { src: '../../../../images/Popup-Scrolling-Image.jpg', class: 'center' }));
            scrollView.append($('<div id="textBlock" />').html(longText));

            scrollView.dxScrollView({
                width: '100%',
                height: '100%'
            });

            return scrollView;
        }
    });
});