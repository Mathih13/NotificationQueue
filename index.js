var queue;

function StartWithMaterialize() {
    queue = new NotifyQueue({ materialUI: true });
}

function StartNormally() {
    queue = new NotifyQueue();
}

function OnStandardSnackbar() {
    queue.notify({
        message: 'This is a notification snackbar! <br> You can add HTML elements like <a href="/#">links</a> to this element.',
    });
}

function OnCustomSnackbar() {
    queue.notify({
        style: {
            opacity: 0.6,
            iconSize: '50px',
            backgroundColor: 'blue',
            fontSize: '24px',
            buttonBackgroundColor: 'red',
        },
        actionText: 'Thanks!',
        message: 'We saved your items!',
    });
}

function OnDurationSnackbar() {
    queue.notify({
        message: 'This will stay on screen for 5 sec before destroying itself',
        duration: 5000,
    });
}


function OnActionSnackbar() {
    queue.notify({
        message: 'This snackbar has custom logic when its action button is pressed',
        action: function () {
            alert('Pressed the action button!')
            this.close();
        },
    });
}

function OnManyDuration() {
    queue.notify({
        message: 'These snackbars are timed, and pushed to the user through a <br>queue with max concurrency of 3',
        duration: 8000,
    });

    queue.notify({
        message: 'These snackbars are timed, and pushed to the user through a <br>queue with max concurrency of 3',
        duration: 7000,
    });

    queue.notify({
        message: 'These snackbars are timed, and pushed to the user through a <br>queue with max concurrency of 3',
        duration: 6000,
    });

    queue.notify({
        message: 'These snackbars are timed, and pushed to the user through a <br>queue with max concurrency of 3',
        duration: 5000,
    });

    queue.notify({
        message: 'These snackbars are timed, and pushed to the user through a <br>queue with max concurrency of 3',
        duration: 4000,
    });

    queue.notify({
        message: 'These snackbars are timed, and pushed to the user through a <br>queue with max concurrency of 3',
        duration: 3000,
    });
}
