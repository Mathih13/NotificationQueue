const container = document.createElement('div');
container.id = 'snackbarContainer';
document.body.appendChild(container);
const maxConcurrency = 3;
appendCss('standard.css');


const styleDefaults = {
    opacity: 1,
    iconSize: '35px',
    backgroundColor: '#444',
    buttonBackgroundColor: 'inherit',
}

const Snack = function (args) {
    /*Adapted from https://codepen.io/wibblymat/pen/avAjq */
    this.paperSnackbar = document.createElement('div');
    const message = args.message;
    const action = args.action;
    const duration = args.duration;
    args.style ? args.style : args.style = styleDefaults;
    args.actionText ? args.actionText : args.actionText = 'Ok';

    Snack.prototype.dismiss = function () {
        let t = this;
        t.getElement().style.opacity = 0;
        t.getElement().remove()

    };

    Snack.prototype.close = function () {
        this.dismiss(this.getElement());
    };

    Snack.prototype.Message = function () { return message };

    Snack.prototype.Visible = function () { return this.paperSnackbar.style.opacity > 0 }

    Snack.prototype.getElement = function () { return this.paperSnackbar };

    Snack.prototype.show = function (done) {
        const t = this;
        this.paperSnackbar.className = 'paper-snackbar';
        this.paperSnackbar.style.backgroundColor = args.style.backgroundColor;

        const infoIcon = document.createElement('i');
        infoIcon.className = 'large material-icons';
        infoIcon.innerHTML = 'info_outline';
        infoIcon.style.fontSize = args.style.iconSize;

        const text = document.createElement('p');
        text.innerHTML = message;
        text.style.fontFamily = "Roboto,sans-serif";
        text.style.lineHeight = 'normal';
        text.style.fontSize = args.style.fontSize;

        const button = document.createElement('button');
        button.className = 'action btn';
        button.innerHTML = args.actionText;
        button.style.fontFamily = "Roboto,sans-serif";
        button.style.backgroundColor = args.style.buttonBackgroundColor;

        this.paperSnackbar.appendChild(infoIcon);
        this.paperSnackbar.appendChild(text);
        this.paperSnackbar.appendChild(button);
        container.appendChild(this.paperSnackbar);

        if (action)
            button.addEventListener('click', action.bind(this));
        else
            button.addEventListener('click', function () {
                t.dismiss(this.paperSnackbar)
                done();
            });


        // In order for the animations to trigger, we have to force the original style to be computed, and then change it.
        getComputedStyle(this.paperSnackbar).bottom;
        this.paperSnackbar.style.opacity = args.style.opacity;

        if (duration != null) {
            setTimeout(function () {
                t.dismiss(this.paperSnackbar);
                done();
            }, duration)
        }
        else
            done();

    };
}

function queue(concurrency) {
    let running = 0
    const taskQueue = []

    const runTask = function (task) {
        running++
        task(function (_) {
            running--
            if (taskQueue.length > 0) {
                runTask(taskQueue.shift())
            }
        })
    }


    const enqueueTask = function (task) { taskQueue.push(task); }

    return {
        push: function (task) {
            running < concurrency ? runTask(task) : enqueueTask(task)
        },
        Running: function () {
            return running;
        },
        NotMax: function () {
            return running < concurrency;
        }

    }
}

const NotifyQueue = function (args) {
    args ? args : args = {};
    if (args.materialUI) {
        appendCss('materialize.min.css')        
    }
    
    const taskRunner = queue(maxConcurrency);


    NotifyQueue.prototype.notify = function (args) {
        let s = new Snack(args);
        taskRunner.push(
            function (done) {
                s.show(done);
            })
    }


}



window.NotifyQueue = NotifyQueue;

function appendCss(url) {
    const head  = document.getElementsByTagName('head')[0];
    const link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = url
    link.media = 'all';
    head.appendChild(link);
}
