var viewModel = {
    username: ko.observable(null),
    users: ko.observableArray([]),
    messages: ko.observableArray([]),
    message: ko.observable(null),
    privateMessages: ko.observableArray([]),
    isLoading: ko.observable(false),
    hasUsername: ko.observable(false),
    hub: {},

    addPublicMessage: function (message) {
        viewModel.messages.push(message);
    },
    addPrivateMessage: function (message) {
        var openItem = ko.utils.arrayFirst(viewModel.privateMessages(), function (item) {
            if (message.fromUserConnectionId == item.fromUserConnectionId)
                return true;
            return false;
        });

        if (!openItem) {
            viewModel.privateMessages.push(
                { connectionId: message.fromUserConnectionId, username: message.fromUser, newMessage: ko.observable(""), messages: ko.observableArray([message.text])});
        } else {
            openItem.messages.push(message.text);   
        }
        viewModel.privateMessages.push(message);
    },

    sendMessage: function () {
        var message = viewModel.message();
        var username = viewModel.username();
        
        viewModel.hub.server.sendMessage(username, message, null);

        viewModel.message(null);
        return false;
    },

    sendPrivateMessage: function(){
        var message = this;

        var username = viewModel.username();
        var privateMessage = message.newMessage();

        var openItem = ko.utils.arrayFirst(viewModel.privateMessages(), function (item) {
            if (message.fromUserConnectionId == item.fromUserConnectionId)
                return true;
            return false;
        });

        openItem.messages.push(privateMessage);

        viewModel.hub.server.sendMessage(username, privateMessage, message.connectionId);

        return false;
    },

    openChatWindow: function () {
        var message = this;
        var openItem = ko.utils.arrayFirst(viewModel.privateMessages(), function (item) {
            if (message.Item1 == item.connectionId)
                return true;
            return false;
        });

        if (openItem)
            return;

        viewModel.privateMessages.push(
                { connectionId: message.Item1, username: message.Item2, newMessage: ko.observable(""), messages: ko.observableArray([])});
    },

    closeChatWindow: function () {
        var message = this;
        viewModel.privateMessages.remove(message);
    },

    selectUsername: function () {
        viewModel.hasUsername(true);
        viewModel.connect();
    },

    connect: function () {
        viewModel.isLoading(true);
        viewModel.hub = $.connection.messages;
        viewModel.hub.client.receivePublicMessage = function (message) {
            viewModel.addPublicMessage(message);
        };
        viewModel.hub.client.receivePrivateMessage = function (message) {
            viewModel.addPrivateMessage(message);
        };
        viewModel.hub.client.updateUsers = function (list) {
            viewModel.users(list);
        };

        $.connection.hub.qs = "name=" + viewModel.username();
        $.connection.hub.start().done(function () {
            viewModel.isLoading(false);
        });
    }
};

ko.applyBindings(viewModel, $("#chat-hub")[0]);




