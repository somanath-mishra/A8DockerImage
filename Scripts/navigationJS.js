GetSiteName();

function injectStyles(rule) {
    var div = $("<div />", {
        html: '&shy;<style>' + rule + '</style>'
    }).appendTo("body");
}

function GetSiteName() {
    if (localStorage.getItem("CompanyIcon")){
        $("#companyImageLeftMenu").attr('src',localStorage.getItem("CompanyIcon"));
    }
    var SiteName=localStorage.getItem("SiteName")
    document.getElementById("lblSiteName").innerHTML = SiteName;
    var _BackGroudColor = localStorage.getItem('BackGroundColor');
    $("#LeftColoumn").css("background-color", _BackGroudColor);
    //$(".nav.side-menu>li.active>a").css("background-color", _BackGroudColor);
    injectStyles('.nav-md { background:' + _BackGroudColor + '}');
    injectStyles('.nav.side-menu>li.active>a { background:' + _BackGroudColor + '}');
}

function defaultNavSetting() {
    CloseLocationDashBoardTabs();
    CloseCaptivePortalTabs();
    CloseRtlsTabs();
    OpenManageSiteTab();
}

function OpenRtlsTabs() {
    document.getElementById('viewdashboard').className = "unhide";
    //document.getElementById('EngageDashBoard').className = "unhide";
    //document.getElementById('RtlsDashBoard').className = "unhide";
    if (document.getElementById('managertls')) {
        document.getElementById('managertls').className = "row margin";
    }
}

function CloseRtlsTabs() {
    //document.getElementById('EngageDashBoard').className = "hide";
    //document.getElementById('RtlsDashBoard').className = "hide";
    if (document.getElementById('managertls')) {
        document.getElementById('managertls').className = "row margin hide";
    }
}

function OpenManageSiteTab() {
    if (document.getElementById('managesite')) {
        document.getElementById('managesite').className = "row margin";
    }

}

function CloseManageSiteTab() {
    if (document.getElementById('managesite')) {
        document.getElementById('managesite').className = "row margin hide";
    }
}

function OpenLocationDashBoardTabs() {
    document.getElementById('viewdashboard').className = "unhide";
    document.getElementById('locationdashboard').className = "unhide";
    if (document.getElementById("managedashboard")) {
        document.getElementById('managedashboard').className = "row margin";
    }

}

function CloseLocationDashBoardTabs() {
    document.getElementById('locationdashboard').className = "hide";
    if (document.getElementById("managedashboard")) {
        document.getElementById('managedashboard').className = "row margin hide";
    }
}

function OpenCaptivePortalTabs() {
    document.getElementById('viewdashboard').className = "unhide";
    //document.getElementById('WifiUser').className = "unhide";
    document.getElementById('WifiUsage').className = "unhide";
    if (document.getElementById('WifiUsageBusi')) {
        if (_MeetGreet == true) {
            document.getElementById('WifiUsageBusi').className = 'unhide';
        }
        else {
            document.getElementById('WifiUsageBusi').className = 'hide';
        }
    }
    if (document.getElementById('managewifiuser')) {
        document.getElementById('managewifiuser').className = "row margin";
    }
    document.getElementById('wifisummary').className = "unhide";
    document.getElementById('WifiReport').className = "unhide";
}

function CloseCaptivePortalTabs() {
    //document.getElementById('WifiUser').className = "hide";
    document.getElementById('WifiUsage').className = "hide";
    if (document.getElementById('WifiUsageBusi')) {
        document.getElementById('WifiUsageBusi').className = 'hide';
    }
    if (document.getElementById('managewifiuser')) {
        document.getElementById('managewifiuser').className = "hide";
    }
    document.getElementById('wifisummary').className = "hide";
    document.getElementById('WifiReport').className = "hide";
    document.getElementById('viewdashboard').className = "hide";
}


function navigation() {
    var _dashboardUrl = localStorage.getItem('dashboardUrl');
    var _managesite = localStorage.getItem('ManageSite');
    var _rtls = localStorage.getItem('rtlsUrl');
    var _cpt = localStorage.getItem('cptUrl');
    var _CaptivePortalUrl = localStorage.getItem('CpUrl');
    var _MeetGreet = localStorage.getItem('MeetGreet');
 

    if (_managesite) {
        CloseLocationDashBoardTabs();
        CloseCaptivePortalTabs();
        CloseRtlsTabs();
        OpenManageSiteTab();
    }
   
    if (( _CaptivePortalUrl) && _dashboardUrl && _rtls)
    {
        OpenCaptivePortalTabs();
        OpenLocationDashBoardTabs();
        OpenRtlsTabs();
    }
    else if ((_cpt || _CaptivePortalUrl) && _dashboardUrl)
    {
        CloseRtlsTabs();
        OpenCaptivePortalTabs();
        OpenLocationDashBoardTabs();
    }
    
    else if(_dashboardUrl && _rtls)
    {
        OpenLocationDashBoardTabs();
        OpenRtlsTabs();
        CloseCaptivePortalTabs();
    }
    
    else if(_rtls && (_cpt || _CaptivePortalUrl))
    {
        OpenRtlsTabs();
        OpenCaptivePortalTabs();
        CloseLocationDashBoardTabs();
    }
    else if (_rtls) {
        CloseLocationDashBoardTabs();
        CloseCaptivePortalTabs();
        OpenRtlsTabs();
    }

    else if (_cpt  || _CaptivePortalUrl) {
        CloseRtlsTabs();
        CloseLocationDashBoardTabs();
        OpenCaptivePortalTabs();
    }
        
    else if (_dashboardUrl) {
        CloseCaptivePortalTabs();
        CloseRtlsTabs();
        OpenLocationDashBoardTabs();
    }

}

