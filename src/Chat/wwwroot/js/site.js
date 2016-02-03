var viewModel = {
    username: ko.observable("New user"),
    messages: ko.observableArray([]),
    message: ko.observable(null),
    isLoading: ko.observable(false),

    addMessage: function (message) {
        viewModel.messages.push(message);
    },

    sendMessage: function () {
        var message = viewModel.message();
        var username = viewModel.username();

        $.ajax({
            url: "/api/messages/sendMessage",
            type: "POST",
            data: { username: username, text: message }
        });
        viewModel.message(null);
        return false;
    },

    init: function () {
        viewModel.isLoading(true);
        $.connection.hub.logging = true;
        var messagesHub = $.connection.messages;
        messagesHub.client.receiveMessage = function (message) {
            viewModel.addMessage(message);
        };
        $.connection.hub.start().done(function () {
            viewModel.isLoading(false);
        });
    }
};
viewModel.init();
ko.applyBindings(viewModel, $("#chat-hub")[0]);




