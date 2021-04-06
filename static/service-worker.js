function getEndpoint() {
    return self.registration.pushManager.getSubscription().then(function (subscription) {
        if (subscription) {
            return subscription.endpoint;
        }

        throw new Error('User not subscribed');
    });
}
self.addEventListener('push', function (event) {
    event.waitUntil(
        getEndpoint()
            .then(function (endpoint) {
                return fetch('./getPayload?endpoint=' + endpoint);
            })
            .then(function (response) {
                return response.text();
            })
            .then(function (payload) {
                self.registration.showNotification('ServiceWorker Cookbook', {
                    body: payload
                });
            })
    );
});
