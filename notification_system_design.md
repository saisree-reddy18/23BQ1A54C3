# Stage 1 - Priority Inbox 
Students get many notifications every day like placements, results, and events. Because of this, important notifications can get missed. To solve this, I created a Priority Inbox that shows the most important notifications first.
I assigned a weight to each notification type:
* Placement = 3
* Result = 2
* Event = 1
I also considered the notification time. A new notification should appear before an older one of the same type.
Priority is calculated using:
Priority Score = Weight + Recency
where Recency = 1 / (milliseconds since notification + 1)
After fetching notifications from the API, I calculate the score for each notification, sort them in descending order, and return the top notifications.
### Steps
1. Fetch notifications from API.
2. Calculate priority score.
3. Sort by score.
4. Return top `n` notifications.
### New Notifications
I do not store notifications locally. Every request fetches fresh data from the API, so new notifications are automatically included and ranked.
### Endpoint
GET /priority-inbox?n=10
The response displays a table containing the notification type, message, timestamp, and priority score.
### Tech Stack
* TypeScript
* Express.js
### Logging
Logs are added for:
* Server start
* Incoming requests
* API fetch operations
* Sorting notifications
* Sending response
* Errors
This helps in tracking application activity and debugging issues.
