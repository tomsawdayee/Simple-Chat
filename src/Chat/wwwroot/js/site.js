var viewModel = {
    username: ko.observable(null),
    users: ko.observableArray([]),
    messages: ko.observableArray([]),
    message: ko.observable(null),
    privateMessages: ko.observableArray([]),
    isLoading: ko.observable(false),
    isConnected: ko.observable(false),
    hub: {},

    addPublicMessage: function (message) {
        viewModel.messages.push(message);
    },
    addPrivateMessage: function (message) {
        var openItem = ko.utils.arrayFirst(viewModel.privateMessages(), function (item) {
            if (message.FromUserConnectionId == item.connectionId())
                return true;
            return false;
        });

        var privateMessageObject = new PrivateMessage(message.FromUser, message.Text, false);

        if (!openItem) {
            viewModel.privateMessages.push(new PrivateChat(message.FromUserConnectionId, message.FromUser, privateMessageObject));
              
        } else {
            openItem.messages.push(privateMessageObject);
        }
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

        var privateMessageObject = new PrivateMessage(username, privateMessage, true);

        openItem.messages.push(privateMessageObject);

        viewModel.hub.server.sendMessage(username, privateMessage, message.connectionId());

        message.newMessage(null);

        return false;
    },

    openChatWindow: function () {
        var message = this;
        var openItem = ko.utils.arrayFirst(viewModel.privateMessages(), function (item) {
            if (message.Item1 == item.connectionId())
                return true;
            return false;
        });

        if (openItem)
            return;

        viewModel.privateMessages.push(new PrivateChat(message.Item1, message.Item2, null));
    },

    closeChatWindow: function () {
        var message = this;
        viewModel.privateMessages.remove(message);
    },

    selectUsername: function () {
        if (viewModel.username() != null)
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
            viewModel.isConnected(true);
        });
    }
};








function PrivateChat(connectionId, username, message)
{
    var self = this;
    self.connectionId = ko.observable(connectionId);
    self.username = ko.observable(username);

    self.newMessage = ko.observable();

    if (message == null)
        self.messages = ko.observableArray([]);
    else
        self.messages = ko.observableArray([new PrivateMessage(message.from, message.text)]);
}

function PrivateMessage(from, text, isSelf)
{
    var self = this;
    self.from = ko.observable(from);
    self.text = ko.observable(text);
    self.isSelf = ko.observable(isSelf);
}
    
ko.applyBindings(viewModel, $("#chat-hub")[0]);




