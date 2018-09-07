# NotificationQueue

A small plugin that allows for Notification style popups on your website.

## Simple Demo
[DEMO](https://mathih13.github.io/NotificationQueue/)

## Installation
To install the plugin simply download notifyQueue.js and standard.css, and refer to notifyQueue.js in your project.

```html
<script src="notifyQueue.js"></script>
```
Or through cdn:
```html
<script src="https://cdn.jsdelivr.net/gh/mathih13/NotificationQueue@1.2/notifyQueue.min.js"></script>
```

## Usage

### Start Using NotifyQueue
To begin using NotificationQueue, simply start a new queue by using the JavaScript keyword "*new*".

```javascript
let queue = new NotifyQueue();
```
By default, only some default styling is applied to the notification boxes. If you wish to load with [Materialize CSS](https://materializecss.com/), simply add the argument materialUI: true to your constructor.

```javascript
let queue = new NotifyQueue({ materialUI: true });
```
*Note: In some cases, this could apply materialize CSS to your entire page. If you are in doubt, do not apply this option.*

### Creating Notifications
Once the queue is set up it is possible to add notifications to it. A notification is created by calling NotifyQueue's function *notify*, and supplying options in its parameter object.

```javascript
queue.notify({
	message:  'This is a notification snackbar! <br> You can add HTML elements like <a href="/#">links</a> to this element.',
});
```

```javascript
let options = {
	message:  'Hi!',
	duration: 3000,
}
queue.notify(options);
```

### Options
```javascript
let options = {
	style: {
		opacity: 0.6, // The opacity of the notifications backgroundcolor
		borderRadius: '0px', // Border radius 
	        boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)', // Box shadow of the notification box
		iconColor: '#fff', // Color if icon
		backgroundColor: 'blue', // The backgroundcolor of the notification box
		fontSize: '24px', // The font size of the main and html
	        textColor: '#fff', // Color of the text
		buttonBackgroundColor: 'red', // The background color of the action button		
	},
	actionText: 'Click me!', // The action buttons text
	message: 'Your order has been received.', // The html to be displayed inside the notification
	duration: 3500, // The duration to show the notification. Leave this blank for indefinite
	action: () => { 
		// The action function contains logic for when the user presses the action button.
		// Leave this blank to make the button = close.
		alert('You did it!')
		saveToLocalStorage(cookie);
		sendImportantData();
		this.close() // Close the notification box
	}
}
```
### Overriding Default Styles
If your website is showing multiple notifications you can override the default styling object of the NotifyQueue so that every subsequent notification inherits the new default style. Note that any styles that are not replaced remain default.

```javascript
const notifications = new NotifyQueue();
let myStyles= {
    backgroundColor: '#fff',
    iconColor: '#999',
    textColor: '#333'
};

notifications.setDefaultStyle(myStyles);
```

### Queuing
Automatically, NotificationQueue will queue notifications that recieve a duration. If the current number of running notifications is 3, NotificationQueue will wait for one of the currently running notifications to finish before showing the next one in line. **This does not apply to notifications without a duration. They will be shown anyway.** 
