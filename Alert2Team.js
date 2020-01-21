/**
Alert2Team

This script redirects an alert to a given team. 
The alert will be the one, which was used to trigger this Remote Action from.

For further support contact us at support@de.derdack.com

v1.0.0 (12.02.2019, Frank Gutacker)

Copyright 2019 Derdack GmbH, www.derdack.com, Enterprise Alert is a registered trademark of Derdack GmbH
*/

var STRING_DB_CONNECTION 	= "Driver=SQL Server Native Client 11.0;Server=(local);Trusted_Connection=Yes;Database=EnterpriseAlert"; // DB connect string
var STRING_SCRIPT_NAME 		= "Alert2Team";

var oDbConn = new ActiveXObject("ADODB.Connection");

function Alert2Team(sExecutor, sTeam, sComment) {
	EAScriptHost.LogDebug("Redirect alert to " + sTeam + " - by " + sExecutor + ".");
	
	try {
		oDbConn.Open(STRING_DB_CONNECTION);
		
		fillTeams();
				
		var oRes = oDbConn.Execute("SELECT TOP 1 AlertID FROM AlertTimelines JOIN RemoteJobsHistory ON (AlertTimelines.ReferenceID=RemoteJobsHistory.ID) WHERE AlertTimelines.ReferenceType=9 AND RemoteJobsHistory.ProfileName='" + sExecutor + "' ORDER BY AlertTimelines.ID DESC");
		var sTicketId = oRes.Fields.Item('AlertID').Value;
		
		oDbConn.Close();
		
		var oTicket;
		oTicket = EAScriptHost.TicketGetByUniqueId(sTicketId);
		
		if (sComment != "") {
			sComment = sComment + ": ";
		}
		var oNewTicket = EAScriptHost.TicketCreate(sTeam, oTicket.GetProperty("serviceFrom"), 0, sComment + oTicket.GetProperty("mm_body"));
		oNewTicket.setProperty("subject", "FW: " + oTicket.GetProperty("subject"));
		oNewTicket.setProperty("serviceFrom", oTicket.GetProperty("serviceFrom"));
		oNewTicket.setProperty("serviceTo", oTicket.GetProperty("serviceTo"));
		oNewTicket.setProperty("priority", oTicket.GetProperty("priority"));
		var iAttCount = oTicket.GetNumberOfAttachments();
		for (var i = 0; i < iAttCount; i++) {
			oNewTicket.AddAttachment(oTicket.GetAttachment(i));
		}
		
		// EAScriptHost.LogDebug(oNewTicket.GetXML());
		oNewTicket.Send();
		
		RAContext.SetExecutionResult(RAContext.ExecutionOK, "Completed", 0);
	} catch(e) {
		
		RAContext.SetExecutionResult(RAContext.ExecutionError, "Error executing command: Alert2Team(" + sExecutor + "," + sTeam + "): " + (e.message ? e.message : e), -1);
	}
}

function fillTeams() {
	try {
		var sTeamnames = "";
		var oRes = oDbConn.Execute("SELECT TeamDisplayName FROM TeamOnCallPlans WHERE ISNULL(TeamID, -1) > -1 ORDER BY TeamDisplayName");
		while (!oRes.EOF) {
			var t1 = (oRes.Fields.Item("TeamDisplayName").Value).toString().replace("'","''");
			sTeamnames = sTeamnames + t1 + ";";
			oRes.MoveNext();
		}
		
		// EAScriptHost.LogDebug("UPDATE RemoteActionParameters SET [Values]='" + sTeamnames + "' WHERE ActionID=(SELECT TOP 1 ID FROM RemoteActions WHERE Name='" + STRING_SCRIPT_NAME + "') AND DisplayName LIKE 'Team%'");
		return oDbConn.Execute("UPDATE RemoteActionParameters SET [Values]='" + sTeamnames + "' WHERE ActionID=(SELECT TOP 1 ID FROM RemoteActions WHERE Name='" + STRING_SCRIPT_NAME + "') AND DisplayName LIKE 'Team%'");
	} catch(e) {
		
		RAContext.SetExecutionResult(RAContext.ExecutionError, "Error executing command: fillTeams(): " + (e.message ? e.message : e), -1);
	}
}