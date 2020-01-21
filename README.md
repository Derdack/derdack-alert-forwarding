# Forward Alerts in Enterprise Alert to a different Team

## Summary

When you receive an alert in the Enterprise Alert app and you are not the right person to handle it, you might want to forward it to a different team. In the following we describe how this can be achieved by a remote action and a script.

Please note, that this is intended to provide the basic idea. Adaptations might be required and we cannot guarantee that everything works as expeted. So, please use at your own risk.

## How does it work?

When an alert comes in a user can acknowledge it in the Enterprise Alert app. After that he or she can go into the alert and then to Remote Action and click the Alert2Text Remote Action.

[App Remote Action](app-alert2team.png)

## Setup

1. Add Script
Please note, you need to habe the Scripting Host / APT licensed.
Install the script Alert2Team.js in the Scripting Host of Enterprise Alert.

The scritpt has two main functions:  
Alert2Teams: Forward the alert to a team.
fillTeams: This will fill in the existing teams in Enterprise Alert into the sTeam field of the Remote Action dynamically.

2. Adapt Database String
In the script please adapt the database string to match your database connection.

3. Create a Remote Action
Create a Remote Action Alert2Team.

The Remote Action executes the function Alert2Team in the script Alert2Team.

[!Alert2Team General](alert2team-general.png)

There are three parameters:  
sExecuter: This is the executer of the remote action. You need to insert the Executer as dynamic content here.
sTeam: This is the team the alert is forwarded to.  
sComment: This is an optional comment you can add to the forwarded alert.  

[!Alert2Team Action](alert2team-app.png)

4. Test It
Now you can create an alert policy and set the above Remote Action as Recommended Remote Action. When you receibe an alert you can acknowledge it in the Enterprise Alert app and then use the Remote Action Alert2Team for forwaring the alert to another team.
