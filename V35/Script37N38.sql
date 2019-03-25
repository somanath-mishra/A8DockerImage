SET GLOBAL event_scheduler = ON;

DROP PROCEDURE IF EXISTS RealTime_Analysis;
CREATE DEFINER=`root`@`localhost` PROCEDURE `RealTime_Analysis`(
In SiteIdValue int,
IN SearchCategory int,
IN FromDateTime varchar(100),
IN ToCurrentDateTime varchar(100),
IN GraphTypeValue int
)
begin
  Declare NasIpAddressValue varchar(40);
  Declare TotalDistinctUsers int;
  Declare RegisteredUsers int;
  Declare TotalSessions int;
  Declare NumberOfSessions int;
  Declare AvgTime float;
  Declare CountMaleUsers int;
  Declare CountFemaleUsers int;
  
  Declare rangeStart13 int;
  Declare rangeStart18 int;
  Declare rangeStart25 int;
  Declare rangeStart35 int;
  Declare rangeStart45 int;
  Declare rangeStart55 int;
  Declare rangeStart65 int;
  
  Declare AndroidUsers int;
  Declare IosUsers int;
  Declare WindowUsers int;
  Declare OtherUsers int;
  
  Declare NetWorkUsageUp double;
  Declare NetWorkUsageDown double;
  Declare TotalNetWorkUsage double;
  Declare AvgNetWorkUsage double;
  Declare PeekUsageInPeriod double;
  Declare SearchCategoryValue int;
 
  START TRANSACTION;

  set NasIpAddressValue=(select NasIpAddress from Site Where SiteId=SiteIdValue);

if(SearchCategory=4)
then     
   #if the date diff between the filter time is less than 12 months 
if(select TIMESTAMPDIFF(hour, FromDateTime, ToCurrentDateTime)<=24)
 then
	set SearchCategoryValue=0;
End if;
IF (select TIMESTAMPDIFF(hour, FromDateTime, ToCurrentDateTime)>=24) and (select TIMESTAMPDIFF(day, FromDateTime, ToCurrentDateTime)<=7)
then	
    set SearchCategoryValue=1;
End if;
IF (select TIMESTAMPDIFF(day, FromDateTime, ToCurrentDateTime)>=7)
then
     set SearchCategoryValue=2;
End if;
ELSE
	set SearchCategoryValue=SearchCategory;
End if;


  #Second need to get the WifiUserCredential filter from the FromDate Time to Current Datetime
DROP  TABLE IF EXISTS `WifiUserCredential_Temp_tbl`;
create temporary table `WifiUserCredential_Temp_tbl` (
  `WifiUserId` int(11) NOT NULL,
  `DeviceId` int(11) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `UserName` varchar(300) CHARACTER SET utf8 DEFAULT NULL,
  `CreatedDateTime` datetime NOT NULL,
  `UpdateDateTime` datetime DEFAULT NULL,
  KEY `IX_WifiUserId` (`WifiUserId`) USING HASH,
  KEY `IX_SiteId` (`SiteId`) USING HASH,
  KEY `IX_UserName` (`UserName`) using HASH,
  KEY `IX_CreatedDateTime` (`CreatedDateTime`) using HASH,
  KEY `IX_UpdateDateTime` (`UpdateDateTime`) using HASH
)
as
select WifiUserId,DeviceId,SiteId,UserName,CreatedDateTime,UpdateDateTime
from WifiUserLoginCredential
where ( SiteId=SiteIdValue and CreatedDateTime>=FromDateTime and CreatedDateTime<=ToCurrentDateTime) or (SiteId=SiteIdValue and UpdateDateTime>=FromDateTime and UpdateDateTime<=ToCurrentDateTime) ;

DROP TABLE IF EXISTS `Acct_Temp_tbl`;
#First need to calculate the FromDate Time to Current Datetime
CREATE temporary table `Acct_Temp_tbl` (
  `radacctid` bigint(21), 
  `username` varchar(64) NOT NULL DEFAULT '',
  `groupname` varchar(64) NULL DEFAULT '',
  `nasipaddress` varchar(15) NOT NULL DEFAULT '',
  `acctstarttime` datetime DEFAULT NULL,
  `acctstoptime` datetime DEFAULT NULL,
  `acctsessiontime` int(12) unsigned DEFAULT NULL,
  `acctauthentic` varchar(32) DEFAULT NULL,
  `connectinfo_start` varchar(50) DEFAULT NULL,
  `connectinfo_stop` varchar(50) DEFAULT NULL,
  `acctinputoctets` bigint(20) DEFAULT NULL,
  `acctoutputoctets` bigint(20) DEFAULT NULL,
  `calledstationid` varchar(50) NOT NULL DEFAULT '',
  `callingstationid` varchar(50) NOT NULL DEFAULT '',
  `framedipaddress` varchar(15) NOT NULL DEFAULT '',
  `WifiUserId` int(11) NOT NULL,
  `DeviceId` int(11) DEFAULT NULL,
  `SiteId` int(11) NOT NULL,
  `CreatedDateTime` datetime NOT NULL,
  `UpdateDateTime` datetime DEFAULT NULL,
  KEY `IX_WifiUserId` (`WifiUserId`) USING HASH,
  KEY `IX_SiteId` (`SiteId`) USING HASH,
  KEY `IX_UserName` (`UserName`) using HASH,
  KEY `IX_CreatedDateTime` (`CreatedDateTime`) using HASH,
  KEY `IX_UpdateDateTime` (`UpdateDateTime`) using HASH,
  KEY `username` (`username`),
  KEY `framedipaddress` (`framedipaddress`),
  KEY `acctstarttime` (`acctstarttime`),
  KEY `acctstoptime` (`acctstoptime`),
  KEY `nasipaddress` (`nasipaddress`)
   )
	as
	SELECT 
    `radacct`.`radacctid`,
	`radacct`.`username`,
    `radacct`.`groupname`,
    `radacct`.`nasipaddress`,
    `radacct`.`acctstarttime`,
    `radacct`.`acctstoptime`,
    `radacct`.`acctsessiontime`,
    `radacct`.`acctauthentic`,
    `radacct`.`connectinfo_start`,
    `radacct`.`connectinfo_stop`,
    `radacct`.`acctinputoctets`,
    `radacct`.`acctoutputoctets`,
    `radacct`.`calledstationid`,
    `radacct`.`callingstationid`,
	WifiUserCredential_Temp_tbl.WifiUserId,
    WifiUserCredential_Temp_tbl.DeviceId,
    WifiUserCredential_Temp_tbl.SiteId,
    WifiUserCredential_Temp_tbl.CreatedDateTime,
    WifiUserCredential_Temp_tbl.UpdateDateTime
FROM  `radius`.`radacct`
INNER JOIN WifiUserCredential_Temp_tbl
ON WifiUserCredential_Temp_tbl.UserName = `radius`.`radacct`.username
where acctstarttime>=FromDateTime and acctstarttime<=ToCurrentDateTime and nasipaddress=NasIpAddressValue;

  
if(GraphTypeValue=100)
then 

#the data is in Minute
set TotalSessions=(select Sum(TIMESTAMPDIFF(SECOND,acctstarttime,acctstoptime)/60) from Acct_Temp_tbl);
#set TotalDistinctUsers=(select Count(distinct(username)) from Acct_Temp_tbl);
set TotalDistinctUsers=(select count(distinct(username)) from Acct_Temp_tbl);

set AvgTime=(select Round(TotalSessions/NULLIF(TotalDistinctUsers,0)));

#Get the number of Sessions from the Radacct
set NumberOfSessions=(select Count(acctsessiontime) from Acct_Temp_tbl);
set RegisteredUsers=(SELECT COUNT(distinct(Acct_Temp_tbl.username)) FROM Acct_Temp_tbl 
where Acct_Temp_tbl.CreatedDateTime>=FromDateTime and Acct_Temp_tbl.CreatedDateTime<=ToCurrentDateTime
);


#set RegisteredUsers=(select count(Id) from WifiUserLoginCredential where WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToCurrentDateTime and SiteId=SiteIdValue);
set CountMaleUsers=(select count(distinct(Acct_Temp_tbl.username)) from WifiUser join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId where WifiUser.GenderId=(select GenderId from Gender where value='Male'));
set CountFemaleUsers=(select count(distinct(Acct_Temp_tbl.username)) from WifiUser join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId  where WifiUser.GenderId=(select GenderId from Gender where value='FeMale'));
#set CountNotAnswered=(select count(UserId) from .WifiUser join .WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToCurrentDateTime and GenderId=(select GenderId from .Gender where value=Null));

set rangeStart13=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=1
group by Acct_Temp_tbl.username)as ageCalc);

set rangeStart18=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=2
group by Acct_Temp_tbl.username)as ageCalc);
set rangeStart25=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=3
group by Acct_Temp_tbl.username)as ageCalc);
set rangeStart35=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=4
group by Acct_Temp_tbl.username)as ageCalc);
set rangeStart45=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=5
group by Acct_Temp_tbl.username)as ageCalc);
set rangeStart55=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=6
group by Acct_Temp_tbl.username)as ageCalc);
set rangeStart65=
(select count(*) from (SELECT COUNT(Acct_Temp_tbl.username) from WifiUser 
join Acct_Temp_tbl on WifiUser.UserId=Acct_Temp_tbl.WifiUserId 
where WifiUser.AgeId=7
group by Acct_Temp_tbl.username)as ageCalc);

#set AndroidUsers=(select Count(*) from .WifiUser where )
#set AndroidUsers=(Select Count(*) from Device join DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Like '%Android%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToCurrentDateTime and SiteId=SiteIdValue);
#set IosUsers=(Select Count(*) from Device join DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Like '%Ios%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToCurrentDateTime and SiteId=SiteIdValue);
#set WindowUsers=(Select Count(*) from Device join DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Like '%Windows%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToCurrentDateTime and SiteId=SiteIdValue);
#set OtherUsers=(Select Count(*) from Device join DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Not Like'%Android%' and OperatingSystem Not Like '%Ios%' and OperatingSystem Not Like'%Windows%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToCurrentDateTime and SiteId=SiteIdValue);

set AndroidUsers=(select count(*) from(select Acct_Temp_tbl.username from Device
inner join Acct_Temp_tbl
on Device.DeviceId=Acct_Temp_tbl.DeviceId
where Device.OperatingSystem like '%Android%' 
group by Acct_Temp_tbl.username) as clcAndroid);

set IosUsers=(select count(*) from(select Acct_Temp_tbl.username from Device
inner join Acct_Temp_tbl
on Device.DeviceId=Acct_Temp_tbl.DeviceId
where Device.OperatingSystem like '%Ios%' 
group by Acct_Temp_tbl.username) as clcIos);


set WindowUsers=(select count(*) from(select Acct_Temp_tbl.username from Device
inner join Acct_Temp_tbl
on Device.DeviceId=Acct_Temp_tbl.DeviceId
where Device.OperatingSystem like '%Windows%' 
group by Acct_Temp_tbl.username) as clcWindow);



set OtherUsers=(select count(*) from(select count(Acct_Temp_tbl.username) from Device
inner join Acct_Temp_tbl
on  Device.DeviceId=Acct_Temp_tbl.DeviceId
where Device.OperatingSystem  Not Like'%Android%' and OperatingSystem Not Like '%Ios%' and OperatingSystem Not Like'%Windows%' 
group by Acct_Temp_tbl.username) as clcAll);

#Convert the bytes data into Mega byte formula(MegaBytesData/(1024*1024))
set NetWorkUsageUp=Round((select sum(`Acct_Temp_tbl`.`AcctinputOctets`)/(1024*1024) from `Acct_Temp_tbl`));
set NetWorkUsageDown=Round((select sum(`Acct_Temp_tbl`.`AcctoutputOctets`)/(1024*1024) from `Acct_Temp_tbl`));
set TotalNetWorkUsage=NetWorkUsageUp+NetWorkUsageDown;  

#Return the Single Model data
 #set NasIpAddressValue=(select NasIpAddress from Site Where SiteId=SiteIdValue);
SELECT IFNULL(NumberOfSessions,0) as TotalSession,IFNULL(TotalDistinctUsers,0) as NoOfUsers,IFNULL(RegisteredUsers,0) as NewUsers,IFNull(AvgTime,0.0) as AverageTime,IFNULL(CountMaleUsers,0) as CountMale,IFNULL(CountFemaleUsers,0) as CountFemale,
IFNULL(rangeStart13,0) as range13,IFNULL(rangeStart18,0) as range18,IFNULL(rangeStart25,0) as range25,IFNULL(rangeStart35,0) as range35,IFNULL(rangeStart45,0) as range45,IFNULL(rangeStart55,0) as range55,IFNULL(rangeStart65,0) as range65,
IFNULL(AndroidUsers,0) as CountAndroid,IFNULL(IOSUsers,0) as CountIOS,IFNULL(WindowUsers,0) as CountWindow,IFNULL(OtherUsers,0) as CountOthers,IFNULL(NetWorkUsageUp,0) as NetWorkUp,IFNULL(NetWorkUsageDown,0) as NetWorkDown,
IFNULL(TotalNetWorkUsage,0) as TotalUsage;
 End if;
 
if (GraphTypeValue=200)
then
	
  set NetWorkUsageUp=Round((select sum(`Acct_Temp_tbl`.`AcctinputOctets`)/(1024*1024) from `Acct_Temp_tbl`));
  set NetWorkUsageDown=Round((select sum(`Acct_Temp_tbl`.`AcctoutputOctets`)/(1024*1024) from `Acct_Temp_tbl`));
  set AvgNetWorkUsage=Round((NetWorkUsageUp+NetWorkUsageDown)/(select Sum(radacctid) from Acct_Temp_tbl));
  set PeekUsageInPeriod=Round((Select Max(acctinputoctets+acctoutputoctets)/(1024*1024) from Acct_Temp_tbl)); 
  Select IfNull(NetWorkUsageUp,0) as NetWorkUsageUp,IfNull(NetWorkUsageDown,0) as NetWorkUsageDown,IfNull(AvgNetWorkUsage,0) as AvgNetWorkUsage,IfNull(PeekUsageInPeriod,0) as PeekUsageInPeriod;
end if;

#select * from Acct_Temp_tbl;
#Hour wise data with 24 years
if(SearchCategoryValue=0)
  then
  
 DROP  TABLE IF EXISTS `DataTableHours`;
 Create temporary table DataTableHours
 (
  HourRange varchar(10),
  Value1 double  default 0,
  Value2 double default 0,
  Value3 double default 0
 );
 
 DROP  TABLE IF EXISTS `HoursTable`;
 Create temporary table HoursTable
 (
  HourRange varchar(10),
  HourRangeDateTime datetime
 );
 
 if(GraphTypeValue=100)
 then
	 Insert into DataTableHours(HourRange,Value1,Value2)
	 SELECT EXTRACT(hour FROM acctstarttime),count(acctsessiontime),
	 avg(TIMESTAMPDIFF(SECOND,acctstarttime,acctstoptime)/60)
	 FROM Acct_Temp_tbl
	 where acctstarttime>= FromDateTime and acctstarttime<= ToCurrentDateTime
	 GROUP BY EXTRACT(hour FROM acctstarttime)
	 ORDER BY EXTRACT(hour FROM acctstarttime) asc; 
 End if;
 if(GraphTypeValue=200)
 then
	DROP  TABLE IF EXISTS `Acct_Temp_tbl_WifiUsage`;
	#First need to calculate the FromDate Time to Current Datetime
	create temporary table Acct_Temp_tbl_WifiUsage
	as
	select radacctid,startdatetime,hours,acctupbandwidth,acctdownbandwidth,NoOfActiveSession,nasipaddress
	from
	radius.radacct_Update_As_Per_Hour
    where startdatetime>=FromDateTime and startdatetime<=ToCurrentDateTime and nasipaddress = NasIpAddressValue;
    
	Insert into DataTableHours(HourRange,Value1,Value2,Value3)
	SELECT hours,acctupbandwidth/(1024*1024),acctdownbandwidth/(1024*1024),NoOfActiveSession
	FROM Acct_Temp_tbl_WifiUsage
	ORDER BY hours asc; 
 END if;


 WHILE FromDateTime < ToCurrentDateTime DO 
 set FromDateTime=Date_Add(FromDateTime,INTERVAL 1 HOUR);
 insert into HoursTable(HourRange,HourRangeDateTime) values(EXTRACT(hour FROM FromDateTime),FromDateTime);
 End While;
 
 Select CAST(HoursTable.HourRange AS UNSIGNED) As Name,IFNULL(DataTableHours.Value1,0) as Value,IFNULL(DataTableHours.Value2,0) as Value1,IFNULL(DataTableHours.Value3,0) as Value2
 FROM HoursTable
 left JOIN DataTableHours ON HoursTable.HourRange=DataTableHours.HourRange
 Order by HoursTable.HourRangeDateTime asc;
 End if;

 #Months with date wise from 1 to 30 date 
if(SearchCategoryValue=1)
 then 
 
 #create the Temp table to store all the week data 
 DROP  TABLE IF EXISTS `DataTableWeek`;
  Create temporary table DataTableWeek
  (
   WeekData varchar(30) ,
   Value1 double default 0,
   Value2 double default 0,
   Value3 double default 0
  );
 
   DROP TABLE IF EXISTS `WeekTable`; 
   Create temporary table WeekTable
   (
    WeekDays varchar(30),
    WeekDateTime DateTime
   );

if(GraphTypeValue=100)
 then
	 insert into DataTableWeek(WeekData,Value1,Value2)
	 SELECT dayname(acctstarttime),count(acctsessiontime),
	 avg(TIMESTAMPDIFF(SECOND,acctstarttime,acctstoptime)/60) from Acct_Temp_tbl
	 #where acctstarttime>=FromDateTime and acctstarttime<=ToCurrentDateTime
	 group by dayname(acctstarttime);
 End if;
 if(GraphTypeValue=200)
 then  
	 insert into DataTableWeek(WeekData,Value1,Value2,Value3)
	 SELECT dayname(acctstarttime),Sum(acctinputoctets)/(1024*1024),Sum(acctoutputoctets)/(1024*1024),count(radacctid) from Acct_Temp_tbl
	 #where acctstarttime>=FromDateTime and acctstarttime<=ToCurrentDateTime
	 group by dayname(acctstarttime);
 END if;

  WHILE FromDateTime < ToCurrentDateTime DO 
   set FromDateTime=Date_Add(FromDateTime,INTERVAL 1 DAY);
   insert into WeekTable(WeekDays,WeekDateTime) values(DAYNAME(FromDateTime),FromDateTime);
 End While;

 
  SELECT WeekTable.WeekDays  As Name,IFNULL(DataTableWeek.Value1,0) as Value,IFNULL(DataTableWeek.Value2,0) as Value1,IFNULL(DataTableWeek.Value3,0) as Value2
  FROM WeekTable
  left JOIN DataTableWeek ON WeekTable.WeekDays=DataTableWeek.WeekData
  Order by WeekTable.WeekDateTime asc;

End if;  
#Search category for the Category of month wise with datetype
if(SearchCategoryValue=2)
  then

DROP TABLE IF EXISTS `DataTableDates`;
 Create temporary table DataTableDates
  (
   DateValue varchar(100),
   Value1 double default 0,
   Value2 double default 0,
   Value3 double default 0
  );
  
  DROP TABLE IF EXISTS `DateRangesTable`;
 Create temporary table DateRangesTable
 (
  DateValue varchar(100),
  NoOfSessions int default 0,
  AvgSessions float default 0
 );
 
Insert into DateRangesTable(DateValue)
SELECT ADDDATE(FromDateTime, INTERVAL @i:=@i+1 DAY) AS DAY
FROM (
SELECT a.a AS DateValue
FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS a
CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS b
CROSS JOIN (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) AS c
) a
JOIN (SELECT @i := -1) r1
WHERE 
@i < DATEDIFF(ToCurrentDateTime, FromDateTime);


#SET @FromDateTime = '2017-08-01 00:00:00', @ToDateTime = '2017-08-31 23:59:00';
if(GraphTypeValue=100)
then
insert into DataTableDates(DateValue,Value1,Value2) 
(SELECT Date(acctstarttime),COUNT(acctsessiontime),avg(TIMESTAMPDIFF(SECOND,acctstarttime,acctstoptime)/60)  FROM  Acct_Temp_tbl
 #Where  acctstarttime >=FromDateTime and acctstarttime <= ToCurrentDateTime
Group by Date(acctstarttime));
End if;
if(GraphTypeValue=200)
then
insert into DataTableDates(DateValue,Value1,Value2,Value3) 
(SELECT Date(acctstarttime),sum(acctinputoctets)/(1024*1024),sum(acctoutputoctets)/(1024*1024),count(radacctid) FROM  Acct_Temp_tbl
 #Where  Date(startdatetime) >= Date(FromDateTime) and Date(startdatetime) <= Date(ToCurrentDateTime)
Group by Date(acctstarttime));
end if;


SELECT DATE_FORMAT(DateRangesTable.DateValue, '%Y-%m-%d') as Name,IfNull(DataTableDates.Value1,0) as Value,IfNull(DataTableDates.Value2,0) as Value1,IfNull(DataTableDates.Value3,0) as Value2
FROM DateRangesTable LEFT JOIN DataTableDates ON Date(DateRangesTable.DateValue) = Date(DataTableDates.DateValue)
ORDER BY DateRangesTable.DateValue,DataTableDates.DateValue;

drop temporary table DateRangesTable;    
drop temporary table DataTableDates;
  
end if;

#Search category for a year wise with per month value
if(SearchCategoryValue=3)
  then
  
DROP TABLE IF EXISTS `DataTableMonth`;
Create temporary table DataTableMonth
 (
  MonthData int,
  YearData int,
  Value1 double default 0,
  Value2 double default 0,
  Value3 double default 0
 );

DROP TABLE IF EXISTS `MonthsTable`; 
Create temporary table MonthsTable
 (
  MonthName varchar(20),
  MonthNumber int,
  MonthYear int
 );

if(GraphTypeValue=100)
 then
insert into DataTableMonth(MonthData,YearData,Value1,Value2)
SELECT MONTH(acctstarttime),Year(acctstarttime),Count(acctsessiontime),
avg(TIMESTAMPDIFF(SECOND,acctstarttime,acctstoptime)/60)  from Acct_Temp_tbl
#where acctstarttime>=FromDateTime and acctstarttime<=ToCurrentDateTime
group by MONTH(acctstarttime),Year(acctstarttime);
End if;
if(GraphTypeValue=200)
then
insert into DataTableMonth(MonthData,YearData,Value1,Value2,Value3)
SELECT MONTH(acctstarttime),Year(acctstarttime),sum(acctinputoctets)/(1024*1024),sum(acctoutputoctets)/(1024*1024),count(radacctid) FROM  Acct_Temp_tbl
#where startdatetime>=FromDateTime and startdatetime<=ToCurrentDateTime
Group by MONTH(acctstarttime),Year(acctstarttime);
End if;

WHILE FromDateTime < Date_Add(ToCurrentDateTime,INTERVAL 0 Month) DO 
 set FromDateTime=Date_Add(FromDateTime,INTERVAL 1 Month);
 insert into MonthsTable(MonthName,MonthNumber,MonthYear) values(MONTHNAME(FromDateTime),MONTH(FromDateTime),Year(FromDateTime));
 End While;

SELECT CONCAT(MonthsTable.MonthName,MonthsTable.MonthYear)  As Name,IFNULL(DataTableMonth.Value1,0) as Value,IFNULL(DataTableMonth.Value2,0) as Value1,IFNULL(DataTableMonth.Value3,0) as Value2
FROM MonthsTable
left JOIN DataTableMonth ON MonthsTable.MonthNumber=DataTableMonth.MonthData and MonthsTable.MonthYear=DataTableMonth.YearData
order by MonthsTable.MonthNumber asc,MonthsTable.MonthYear asc;

drop temporary table MonthsTable;    
drop temporary table DataTableMonth;

end if;


drop temporary table Acct_Temp_tbl;
drop temporary table WifiUserCredential_Temp_tbl;

Commit;
#Retrurn the Network Usage 
End;

DROP PROCEDURE IF EXISTS TotalSessionsLastHour;
CREATE PROCEDURE TotalSessionsLastHour(
IN SiteId int
)
BEGIN
Declare TotalNoOfSessions int;
Declare NasIP varchar(20);

DROP  TABLE IF EXISTS `Temptabledata`;
 Create temporary TABLE IF NOT EXISTS Temptabledata
 (
   #id int Primary Key AUTO_INCREMENT,
   UserName varchar(64),
   TotalSessions int
 );
 
set NasIP=(select Site.NasIpAddress from Site where Site.SiteId=SiteId limit 1);

#select NasIP;

insert into Temptabledata(Username,TotalSessions)
SELECT radacct.username AS UserName, COUNT(*) AS TotalSessions FROM radius.radacct 
WHERE acctstoptime IS NULL and acctstarttime>(NOW() - INTERVAL 1 HOUR)
and nasipaddress=NasIP
GROUP BY UserName;

#select * from Temptabledata;

DROP  TABLE IF EXISTS `TempSiteUsers`;
Create temporary TABLE IF NOT EXISTS TempSiteUsers
 (
   #id int Primary Key AUTO_INCREMENT,
   UserName varchar(64),
   SiteId int
 );
 
insert into TempSiteUsers(UserName,SiteId)
select WifiUserLoginCredential.UserName AS UserName,
WifiUserLoginCredential.SiteId AS SiteId
FROM
WifiUserLoginCredential
where WifiUserLoginCredential.SiteId=SiteId;


DROP  TABLE IF EXISTS `CountNoOfSessions`;
 Create temporary TABLE IF NOT EXISTS CountNoOfSessions
 (
   #id int Primary Key AUTO_INCREMENT,
   UserName varchar(64),
   Count int
 );
 
insert into CountNoOfSessions(UserName,Count)
SELECT distinct t1.UserName as UserName, t1.TotalSessions as Count
FROM Temptabledata t1
INNER JOIN TempSiteUsers t2 ON t1.UserName=t2.UserName;
Set TotalNoOfSessions=(SELECT SUM(CountNoOfSessions.Count) as TotalSessions from CountNoOfSessions);

select TotalNoOfSessions as Count;

END;

DROP PROCEDURE IF EXISTS DeleteWifiUserAccount;
CREATE PROCEDURE DeleteWifiUserAccount(
IN NetSiteId int,
IN MacAdd varchar(100),
IN SitId int,
IN Uname varchar(300)
)
BEGIN
Declare DevId int;
declare countDeviceAsSite int;
declare countWifiUserCredentSite int;
declare countWifiUserCredNetwork int;
declare countDevice int;
Declare WifiId int;

#Get the WifiUserId from the UserName
set WifiId=(select UserId from WifiUser where UserName=Uname);
#Get the DeviceId from the macaddress
set DevId=(select DeviceId from Device where MacAddress=MacAdd);

#SET FOREIGN_KEY_CHECKS = 0; 
delete from WifiUserLoginCredential where DeviceId=DevId and WifiUserId=WifiId and NetWorkOfSiteId=NetSiteId;
#Check the device present in muliple network of site or not
set countWifiUserCredentSite=(select count(*) from WifiUserLoginCredential where DeviceId=DevId and SiteId=SitId);
#check the device present in multiple site or not
set countWifiUserCredNetwork=(select count(*) from WifiUserLoginCredential where DeviceId=DevId  and WifiUserId=WifiId);
#if there is device in one site and wificredential also one in network then delete all the wifiUser and device
set countDevice=(select count(*) from WifiUserLoginCredential where DeviceId=DevId);

#if the device present in mulltiple site and then just remove the composite relationship
IF countWifiUserCredentSite=0  THEN
  delete from DeviceAssociateSite where DeviceId=DevId and SiteId=SitId;
End if;
#if the device present in mulltiple site and then just remove the composite relationship
IF countDevice=0 THEN
  delete from Device where DeviceId=DevId;
END if;
IF countWifiUserCredNetwork=0 THEN
  delete from UsersAddress where UserId=wifiId;
  delete from WifiUser where UserId=wifiId;
End if;
END;

DROP PROCEDURE IF EXISTS DeleteSite;
CREATE PROCEDURE DeleteSite(
IN DelSiteId int
)
BEGIN

DECLARE errno INT;
DECLARE errmsg VARCHAR(100);
DECLARE done BOOLEAN DEFAULT FALSE;
DECLARE _id BIGINT UNSIGNED;
DECLARE cur CURSOR FOR SELECT NetWorkOfSiteId FROM NetWorkOfSite WHERE SiteId=DelSiteId;
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done := TRUE;

DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
BEGIN
GET CURRENT DIAGNOSTICS CONDITION 1 errno = MYSQL_ERRNO;
    SELECT errno AS MYSQL_ERROR;    
    ROLLBACK;
END;

START TRANSACTION;

SET SQL_SAFE_UPDATES=0;

OPEN cur;

  DelSsidLoop: LOOP
    FETCH cur INTO _id;
    IF done THEN
      LEAVE DelSsidLoop;
    END IF;
    CALL DelSSIDWithoutCommit(_id);
  END LOOP DelSsidLoop;

CLOSE cur;

Delete From AdminSiteAccess where SiteId=DelSiteId;
Delete From Users where SiteId=DelSiteId;
Delete From RadiusConfiguration where SiteId=DelSiteId;
Delete From NasConfiguration where SiteId=DelSiteId;
Delete From WifiUserLoginCredential where SiteId=DelSiteId;

Delete From Package where SiteId=DelSiteId;
Delete From DeviceAssociateSite where SiteId=DelSiteId;

DELETE FROM Device
WHERE DeviceId NOT IN (
    SELECT DeviceId FROM (
        SELECT DISTINCT DeviceAssociateSite.DeviceId AS DeviceId FROM DeviceAssociateSite 
        INNER JOIN Device ON Device.DeviceId=DeviceAssociateSite.DeviceId
    ) AS c
);

DELETE FROM UsersAddress
WHERE UserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN UsersAddress ON UsersAddress.UserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

DELETE FROM WifiUser
WHERE UserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN WifiUser ON WifiUser.UserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

Delete From RtlsConfiguration where SiteId=DelSiteId;
Delete From Site where SiteId=DelSiteId;

COMMIT;
END;


DROP PROCEDURE IF EXISTS DeleteSSID;
CREATE PROCEDURE DeleteSSID(
IN NetSiteId int
)
BEGIN
DECLARE errno INT;
DECLARE EXIT HANDLER FOR SQLEXCEPTION, SQLWARNING
BEGIN
GET CURRENT DIAGNOSTICS CONDITION 1 errno = MYSQL_ERRNO;
    SELECT errno AS MYSQL_ERROR;
    ROLLBACK;
END;

SET @TS = DATE_FORMAT(NOW(),'_%Y_%m_%d_%H_%i_%s');
 
SET @FOLDER = '/var/lib/mysql-files/';
SET @PREFIX = 'WifiUserData';
SET @EXT    = '.csv';
SET @ID=NetSiteId;
 
SET @CMD = CONCAT("select * from WifiUserLoginCredential where NetWorkOfSiteId=",@ID," INTO OUTFILE '",@FOLDER,@PREFIX,@TS,@EXT,@ID,
    "' FIELDS ENCLOSED BY '\"' TERMINATED BY ';' ESCAPED BY '\"'",
    "  LINES TERMINATED BY '\r\n';");
 
PREPARE statement FROM @CMD;

EXECUTE statement;

START TRANSACTION;

SET SQL_SAFE_UPDATES=0;

Delete from AdminSiteAccess where NetWorkOfsiteId=NetSiteId;
Delete from TermsAndCondition where NetWorkOfsiteId=NetSiteId;
Delete from Events where NetworkOfsiteId=NetSiteId;
Delete from WifiUserLoginCredential where NetWorkOfSiteId=NetSiteId;
Delete from ManagePromotion where FormId=NetSiteId;
Delete from FormControl where FormId=NetSiteId;
Delete from Form where NetworkOfSiteId=NetSiteId;
Delete FROM UserUsagePackage WHERE SSIdPackageId IN 
(SELECT SSIdPackageId FROM SSIDPackage where NetWorkOfSiteId=NetSiteId);
Delete from SSIDPackage where NetWorkOfsiteId=NetSiteId;

DELETE FROM Device
WHERE WifiUserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN Device ON Device.WifiUserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

DELETE FROM UsersAddress
WHERE UserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN UsersAddress ON UsersAddress.UserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

DELETE FROM WifiUser
WHERE UserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN WifiUser ON WifiUser.UserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

Delete from NetWorkOfSite where NetWorkOfSiteId=NetSiteId;

COMMIT;

END;

DROP PROCEDURE IF EXISTS DelSSIDWithoutCommit;
CREATE PROCEDURE DelSSIDWithoutCommit(
IN NetSiteId int
)
BEGIN

SET @TS = DATE_FORMAT(NOW(),'_%Y_%m_%d_%H_%i_%s');
 
SET @FOLDER = '/var/lib/mysql-files/';
SET @PREFIX = 'WifiUserData';
SET @EXT    = '.csv';
SET @ID=NetSiteId;
 
SET @CMD = CONCAT("select * from WifiUserLoginCredential where NetWorkOfSiteId=",@ID," INTO OUTFILE '",@FOLDER,@PREFIX,@TS,@EXT,@ID,
    "' FIELDS ENCLOSED BY '\"' TERMINATED BY ';' ESCAPED BY '\"'",
    "  LINES TERMINATED BY '\r\n';");
 
PREPARE statement FROM @CMD;

EXECUTE statement;

SET SQL_SAFE_UPDATES=0;

Delete from AdminSiteAccess where NetWorkOfsiteId=NetSiteId;
Delete from TermsAndCondition where NetWorkOfsiteId=NetSiteId;
Delete from Events where NetworkOfsiteId=NetSiteId;
Delete from WifiUserLoginCredential where NetWorkOfSiteId=NetSiteId;
Delete from ManagePromotion where FormId=NetSiteId;
Delete from FormControl where FormId=NetSiteId;
Delete from Form where NetworkOfSiteId=NetSiteId;
Delete FROM UserUsagePackage WHERE SSIdPackageId IN 
(SELECT SSIdPackageId FROM SSIDPackage where NetWorkOfSiteId=NetSiteId);
Delete from SSIDPackage where NetWorkOfsiteId=NetSiteId;

DELETE FROM Device
WHERE WifiUserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN Device ON Device.WifiUserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

DELETE FROM UsersAddress
WHERE UserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN UsersAddress ON UsersAddress.UserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

DELETE FROM WifiUser
WHERE UserId NOT IN (
    SELECT WifiUserId FROM (
        SELECT DISTINCT WifiUserLoginCredential.WifiUserId AS WifiUserId FROM WifiUserLoginCredential 
        INNER JOIN WifiUser ON WifiUser.UserId=WifiUserLoginCredential.WifiUserId
    ) AS c
);

Delete from NetWorkOfSite where NetWorkOfSiteId=NetSiteId;

END;


DROP PROCEDURE IF EXISTS ArchiveEventData;
CREATE PROCEDURE ArchiveEventData(
IN ArchiveEventId int)
BEGIN
SET @TS = DATE_FORMAT(NOW(),'_%Y_%m_%d_%H_%i_%s');
 
SET @FOLDER = '/var/lib/mysql-files/';
SET @PREFIX = 'EventData';
SET @EXT    = '.csv';
SET @ID=ArchiveEventId;
 
SET @CMD = CONCAT("select Events.EventName, WifiUser.UserName,WifiUser.FirstName,WifiUser.LastName,WifiUser.Custom1,EventAttendee.Login,
EventAttendee.Logout from WifiUser inner join EventAttendee 
on EventAttendee.WifiUserId=WifiUser.UserId inner join Events on Events.EventId=EventAttendee.EventId 
where EventAttendee.EventId=",@ID," INTO OUTFILE '",@FOLDER,@PREFIX,@TS,@EXT,
    
"' FIELDS ENCLOSED BY '\"' TERMINATED BY ';' ESCAPED BY '\"'",
    "  LINES TERMINATED BY '\r\n';");
 
PREPARE statement FROM @CMD;

EXECUTE statement;

SET SQL_SAFE_UPDATES=0;
Delete from Events where Events.EventId=ArchiveEventId;
END;

DROP PROCEDURE IF EXISTS ArchiveRTLSData;
CREATE PROCEDURE ArchiveRTLSData
(
 IN EngageSiteName varchar(50)
)
BEGIN
SET @TS = DATE_FORMAT(NOW(),'_%Y_%m_%d_%H_%i_%s');
 
SET @FOLDER = '/var/lib/mysql-files/';

SET @PREFIX = 'RTLSData';
SET @EXT    = '.csv';
 
SET @CMD = CONCAT("SELECT * FROM LocationData
 INTO OUTFILE '",@FOLDER,@PREFIX,@TS,@EXT,
    
"' FIELDS ENCLOSED BY '\"' TERMINATED BY ';' ESCAPED BY '\"'",
    
"  LINES TERMINATED BY '\r\n';");
 
PREPARE statement FROM @CMD;
 
EXECUTE statement;

SET SQL_SAFE_UPDATES=0;
Delete from LocationData where LocationData.sn=EngageSiteName;
END;

DROP PROCEDURE IF EXISTS CalculateDataPackage;
CREATE PROCEDURE CalculateDataPackage()
BEGIN
DROP  TABLE IF EXISTS DataPackage;
Create temporary TABLE IF NOT EXISTS DataPackage
 (
   username varchar(64),
   framedipaddress varchar(30),
   nasipaddress varchar(30)
 );
insert into DataPackage(username,framedipaddress,nasipaddress)
 select radius.radacct.username,radius.radacct.framedipaddress,radius.radacct.nasipaddress from WifiUserLoginCredential
   inner join radius.radacct
   on radius.radacct.username = WifiUserLoginCredential.UserName
   inner join UserUsagePackage
   on UserUsagePackage.UserId=WifiUserLoginCredential.WifiUserId
   inner join SSIDPackage
   on  SSIDPackage.SSIDPackageId = UserUsagePackage.SSIDPackageId and SSIDPackage.PackageStatus=10
   inner join Package
   on Package.PackageId=SSIDPackage.PackageId and UserUsagePackage.PerDataUsed >= (Package.PackageValidity+UserUsagePackage.ExtraValidity) and Package.PackageValidity >0
   where radius.radacct.acctstoptime is null;
  
SET SQL_SAFE_UPDATES = 0;
Update UserUsagePackage set UserUsagePackage.isActive=false 
where UserId IN (Select WifiUserId from WifiUserLoginCredential join DataPackage on WifiUserLoginCredential.UserName=DataPackage.UserName);
select username,framedipaddress,nasipaddress from DataPackage;
END

DROP PROCEDURE IF EXISTS CalculatePeriodPackage;
CREATE PROCEDURE CalculatePeriodPackage()
BEGIN
DROP TABLE IF EXISTS PeriodPackage;
Create temporary TABLE IF NOT EXISTS PeriodPackage
 (
  
   username varchar(64),
   framedipaddress varchar(30),
   nasipaddress varchar(30)
 );
insert into PeriodPackage(username,framedipaddress,nasipaddress)
select radius.radacct.username,radius.radacct.framedipaddress,radius.radacct.nasipaddress from radius.radacct where
 UserName in 
(select UserName from wifiuserlogincredential where
 WifiUserId in (select UserId from userusagepackage
where userusagepackage.PackageEndTime <= NOW())) and acctstoptime is null;

SET SQL_SAFE_UPDATES = 0;
Update userusagepackage set userusagepackage.isActive=false 
where UserId IN(Select WifiUserId from wifiuserlogincredential join PeriodPackage on wifiuserlogincredential.UserName=PeriodPackage.UserName);

select username,framedipaddress,nasipaddress from PeriodPackage;
END;


DROP PROCEDURE IF EXISTS CalculateSessionPackage;
CREATE PROCEDURE CalculateSessionPackage()
BEGIN
DROP  TABLE IF EXISTS SessionData;
Create temporary TABLE IF NOT EXISTS SessionData
 (
   username varchar(64),
   framedipaddress varchar(30),
   nasipaddress varchar(30)
 );
insert into SessionData(username,framedipaddress,nasipaddress)
 select radius.radacct.username,radius.radacct.framedipaddress,radius.radacct.nasipaddress from WifiUserLoginCredential
   inner join radius.radacct
   on radius.radacct.username = WifiUserLoginCredential.UserName
   inner join UserUsagePackage
   on UserUsagePackage.UserId=WifiUserLoginCredential.WifiUserId
   inner join SSIDPackage
   on  SSIDPackage.SSIDPackageId = UserUsagePackage.SSIDPackageId and SSIDPackage.PackageStatus=10
   inner join Package
   on Package.PackageId=SSIDPackage.PackageId and Package.PackageType=20
   where UserUsagePackage.PackageEndTime <= NOW() and radius.radacct.acctstoptime is null;

SET SQL_SAFE_UPDATES = 0;
Update UserUsagePackage set UserUsagePackage.isActive=false 
where UserId IN(Select WifiUserId from WifiUserLoginCredential join SessionData on WifiUserLoginCredential.UserName=SessionData.UserName);

select username,framedipaddress,nasipaddress from SessionData;

END

DROP PROCEDURE IF EXISTS UsageMangeProcedure;
CREATE PROCEDURE UsageMangeProcedure()
BEGIN
SET SQL_SAFE_UPDATES=0;
update SSIDPackages 
set PackageStatus=10 
where SSIDPackage.SSIdPackageId in (select tblTmp.SSIDPackageId 
from(select SSIDPackage.SSIDPackageId from 
SSIDPackages where SSIDPackage.FromDateTime = DATE(NOW())
and SSIDPackage.PackageStatus=20)tblTmp);
END;

DROP PROCEDURE IF EXISTS UpdatePackageStatus;
CREATE PROCEDURE UpdatePackageStatus()
BEGIN
set SQL_SAFE_UPDATES=0;

Update SSIDPackage set PackageStatus=10
where (PackageStatus=20 and FromDateTime<=DATE(NOW()));

update SSIDPackage set PackageStatus=30 where SSIdPackageId in(select t.SSIdPackageId from 
(select min(SSIdPackageId) as SSIdPackageId from SSIDPackage where PackageStatus=10 group by PackageId having count(*)=2)t) 
or ToDateTime<DATE(NOW());
END;

DROP EVENT IF EXISTS PackageStatus;
CREATE EVENT PackageStatus
ON SCHEDULE
EVERY 1 day
COMMENT 'Update Package Status'
DO
BEGIN
CALL UpdatePackageStatus;
END;


DROP PROCEDURE IF EXISTS PerDataUsedforDataType;
CREATE PROCEDURE PerDataUsedforDataType()
BEGIN

Set SQL_SAFE_UPDATES=0;
Update UserUsagePackage 
set PackageEndTime=CURRENT_TIMESTAMP(),IsActive=0 where UserPackageId NOT IN(
SELECT Id from (SELECT Max(UserPackageId) as Id from UserUsagePackage GROUP BY UserId) AS t) and IsActive=1;

DROP  TABLE IF EXISTS `Temptabledata`;
 
Create temporary TABLE IF NOT EXISTS Temptabledata
 (
   #id int Primary Key AUTO_INCREMENT,
   WifiUserId int,
   PerDataUsed varchar(64),
   acctstarttime bigint(20),
   PackageStartTime datetime
 );

Set SQL_SAFE_UPDATES=0;

insert into Temptabledata()
select a.WifiUserId as WifiUserId,(SUM(d.acctinputoctets)+SUM(d.acctoutputoctets)) as PerDataUsed,
d.acctstarttime as acctstarttime, b.PackageStartTime as PackageStartTime from 
UserUsagePackage b,WifiUserLoginCredential a, WifiUser c,radius.radacct d
where (b.UserId=c.UserId and c.UserId=a.WifiUserId and d.username=a.UserName) and (b.IsActive=1)
group by a.WifiUserId,d.acctstarttime,b.PackageStartTime having d.acctstarttime>=b.PackageStartTime;

UPDATE UserUsagePackage
INNER JOIN (
  SELECT WifiUserId, SUM(PerDataUsed) as total
  FROM Temptabledata
  GROUP BY WifiUserId
) x ON UserUsagePackage.UserId = x.WifiUserId
SET UserUsagePackage.PerDataUsed = x.total
where UserUsagePackage.IsActive=1;

END;

DROP PROCEDURE IF EXISTS EventLogInAndLogOutTime;
CREATE PROCEDURE EventLogInAndLogOutTime()
BEGIN
SET SQL_SAFE_UPDATES=0;
UPDATE EventAttendee A
JOIN WifiUserLoginCredential B ON A.WifiUserId = B.WifiUserId
JOIN Events E ON E.EventId = A.EventId AND E.NetworkOfSiteId= B.NetWorkOfSiteId
JOIN (Select radacct.username, radacct.acctstoptime as acctstoptime, radacct.acctstarttime as acctstarttime from radius.radacct) As C ON B.UserName = C.username
SET A.Logout = (select C.acctstoptime where Date(C.acctstoptime) = Date(E.EventEndDateTime))
ORDER BY radacctid 
LIMIT 1;
End;

DROP EVENT IF EXISTS CalEventLoginAndLogoutTime;
CREATE EVENT CalEventLoginAndLogoutTime
ON SCHEDULE
EVERY 1 hour
COMMENT 'Log if user attended the Event'
DO
BEGIN
CALL EventLogInAndLogOutTime;
END;

DROP EVENT IF EXISTS PerDataUsed;
CREATE EVENT PerDataUsed
ON SCHEDULE
EVERY 2 second
COMMENT 'Data Used for PackageType-Data'
DO
BEGIN
CALL PerDataUsedforDataType;
END;

DROP PROCEDURE IF EXISTS sp_GetAccountDetails_As_Per_MacAddress;
CREATE PROCEDURE sp_GetAccountDetails_As_Per_MacAddress(
 In MacAddress varchar(100),
 In NasIpAddress varchar(100)
)
Begin
   START TRANSACTION;
   Select username,framedipaddress,
nasipaddress from radius.radacct where callingstationid=MacAddress 
and nasipaddress=NasIpAddress and acctstoptime is null;

END;

DROP PROCEDURE IF EXISTS UserLevelPackageUsage;
CREATE PROCEDURE `UserLevelPackageUsage`(
IN WifiUserId int
)
BEGIN
DROP  TABLE IF EXISTS `Temptabledata`; 
Create temporary TABLE IF NOT EXISTS Temptabledata
 (
   #id int Primary Key AUTO_INCREMENT,
   WifiUserId int,   
   acctstarttime datetime,
   acctstoptime datetime,
   TotalTime time,
   DataUsed bigint(20),
   PackageStartTime datetime
 );
insert into Temptabledata()
select a.WifiUserId as WifiUserId,
d.acctstarttime as acctstarttime,
d.acctstoptime as acctstoptime,
timediff(d.acctstoptime,d.acctstarttime) as TotalTime,
SUM(d.acctinputoctets)+SUM(d.acctoutputoctets) as DataUsed,
b.PackageStartTime as PackageStartTime from 
UserUsagePackage b,WifiUserLoginCredential a, WifiUser c,radius.radacct d
where (b.UserId=c.UserId and c.UserId=a.WifiUserId and d.username=a.UserName) and (b.IsActive=1)
and b.UserId=WifiUserId
group by a.WifiUserId,d.acctstarttime,d.acctstoptime,b.PackageStartTime having d.acctstarttime>=b.PackageStartTime;

select * from Temptabledata;
END;

DROP PROCEDURE IF EXISTS DeleteWifiUserFromNetwork;
CREATE PROCEDURE DeleteWifiUserFromNetwork(
IN NetSiteId int,
IN MacAdd varchar(100)
)
BEGIN
Declare DevId int;
Declare WifiId int;
Declare countWifiUserCredNetwork int;

#Delete the device as per MacAddress
set DevId=(select DeviceId from Device where MacAddress=MacAdd);

#Get the WifiUserId from the WifiCrednetial table 
set WifiId=(select WifiUserId from WifiUserLoginCredential where DeviceId=DevId and  NetWorkOfSiteId=NetSiteId);

#Delete the WifiUserCredential as deviceId and networkOfSiteId 
delete from WifiUserLoginCredential where DeviceId=DevId and WifiUserId=WifiId and NetWorkOfSiteId=NetSiteId;

#count the 
set countWifiUserCredNetwork=(select count(*) from WifiUserLoginCredential where DeviceId=DevId  and WifiUserId=WifiId);

if countWifiUserCredNetwork=0 THEN
 delete from UsersAddress where UserId=WifiId;
 delete from WifiUser where UserId=WifiId;
End if;
END;

DROP PROCEDURE IF EXISTS WiFiReportData;
CREATE PROCEDURE WiFiReportData(
IN SiteIdValue int,
IN FromDateTime varchar(100),
IN ToDateTime varchar(100)
)
begin
  Declare NasIpAddressValue varchar(40);
  Declare TotalDistinctUsers int;
  Declare RegisteredUsers int;
  Declare TotalSessions int;
  Declare NumberOfSessions int;
  Declare AvgTime float;
  Declare CountMaleUsers int;
  Declare CountFemaleUsers int;
  Declare CountNotAnswered int;
  Declare CountNotAnswer int;
  
  Declare rangeStart13 int;
  Declare rangeStart18 int;
  Declare rangeStart25 int;
  Declare rangeStart35 int;
  Declare rangeStart45 int;
  Declare rangeStart55 int;
  Declare rangeStart65 int;
  
  Declare AndroidUsers int;
  Declare IosUsers int;
  Declare WindowUsers int;
  Declare OtherUsers int;
 
  
 
  START TRANSACTION;

  #set NasIpAddressValue=(select NasIpAddress from a8platformdbtest.Site Where SiteId=SiteIdValue);
  
  DROP  TABLE IF EXISTS `Acct_Temp_tbl`;
  #First need to calculate the FromDate Time to Current Datetime
  create temporary table Acct_Temp_tbl
	as
	SELECT `radacct`.`radacctid`,
    `radacct`.`username`,
    `radacct`.`groupname`,
    `radacct`.`nasipaddress`,
    `radacct`.`acctstarttime`,
    `radacct`.`acctstoptime`,
    `radacct`.`acctsessiontime`,
    `radacct`.`acctauthentic`,
    `radacct`.`connectinfo_start`,
    `radacct`.`connectinfo_stop`,
    `radacct`.`acctinputoctets`,
    `radacct`.`acctoutputoctets`,
    `radacct`.`calledstationid`,
    `radacct`.`callingstationid`,
    `radacct`.`acctterminatecause`,
    `radacct`.`framedipaddress`

FROM  `radius`.`radacct`
where Date(acctstarttime)>=Date(FromDateTime) and Date(acctstarttime)<=Date(ToDateTime);
set NasIpAddressValue=(select a8platformdbtest.Site.NasIpAddress from Site where SiteId=SiteIdValue);
#the data is in Minute
set TotalSessions=(select sum(acctsessiontime)/60 from Acct_Temp_tbl);
set TotalDistinctUsers=(select Count(distinct(username)) from Acct_Temp_tbl);
set AvgTime=(select Round(TotalSessions/TotalDistinctUsers));

#Get the number of Sessions from the Radacct
set NumberOfSessions=(select Count(acctsessiontime) from Acct_Temp_tbl where nasipaddress=NasIpAddressValue);
set RegisteredUsers=(select Count(*) from a8platformdbtest.WifiUserLoginCredential where WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime  and WifiUserLoginCredential.SiteId=SiteIdValue);
set CountMaleUsers=(select count(UserId) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue and GenderId=(select GenderId from a8platformdbtest.Gender where value='Male'));
set CountFemaleUsers=(select count(UserId) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue and GenderId=(select GenderId from a8platformdbtest.Gender where value='FeMale'));
set CountNotAnswered=(select count(UserId) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue and GenderId=(select GenderId from a8platformdbtest.Gender where value=Null));

set rangeStart13=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=1 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);
set rangeStart18=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=2 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);
set rangeStart25=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=3 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);
set rangeStart35=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=4 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);
set rangeStart45=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=5 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);
set rangeStart55=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=6 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);
set rangeStart65=(SELECT COUNT(*) from a8platformdbtest.WifiUser join a8platformdbtest.WifiUserLoginCredential on WifiUser.UserName=WifiUserLoginCredential.UserName where AgeId=7 and WifiUserLoginCredential.CreatedDateTime>=FromDateTime and WifiUserLoginCredential.CreatedDateTime<=ToDateTime and WifiUserLoginCredential.SiteId=SiteIdValue);

#set AndroidUsers=(select Count(*) from a8platformdbtest.WifiUser where )
set AndroidUsers=(Select Count(*) from a8platformdbtest.Device join a8platformdbtest.DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Like '%Android%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToDateTime and DeviceAssociateSite.SiteId=SiteIdValue);
set IosUsers=(Select Count(*) from a8platformdbtest.Device join a8platformdbtest.DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Like '%Ios%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToDateTime and DeviceAssociateSite.SiteId=SiteIdValue);
set WindowUsers=(Select Count(*) from a8platformdbtest.Device join a8platformdbtest.DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Like '%Windows%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToDateTime and DeviceAssociateSite.SiteId=SiteIdValue);
set OtherUsers=(Select Count(*) from a8platformdbtest.Device join a8platformdbtest.DeviceAssociateSite on Device.DeviceId=DeviceAssociateSite.DeviceId where OperatingSystem Not Like'%Android%' and OperatingSystem Not Like '%Ios%' and OperatingSystem Not Like'%Windows%' and DeviceAssociateSite.CreatedDateTime>=FromDateTime and DeviceAssociateSite.CreatedDateTime<=ToDateTime and DeviceAssociateSite.SiteId=SiteIdValue);


SELECT NumberOfSessions as NumberOfSessions,RegisteredUsers as NoOfUsers,CountMaleUsers as CountMale,CountFemaleUsers as CountFemale,CountNotAnswer as CountNotAnswered,
rangeStart13 as range13,rangeStart18 as range18,rangeStart25 as range25,rangeStart35 as range35,rangeStart45 as range45,rangeStart55 as range55,rangeStart65 as range65,
AndroidUsers as CountAndroid,IOSUsers as CountIOS,WindowUsers as CountWindow,OtherUsers as CountOthers;
Commit;
End;

DROP PROCEDURE IF EXISTS DeleteAssociateNetworkWithWifiCrednetial;
CREATE  PROCEDURE DeleteAssociateNetworkWithWifiCrednetial(
 in AssociateNetworkOfSiteId int
)
BEGIN
#Get all the wifiCredentialId from from the associate netoek

DELETE from WifiUserLoginCredential WHERE Id IN (Select Id from(Select Id from WifiUserLoginCredential where NetworkOfSiteId=AssociateNetworkOfSiteId and IsRegisterFromAssociateNetwork=true) as tmptbl);

#Delete the associate network from the associatenetworksiteid 
Delete from AsssociateNetwork where Id=AssociateNetworkOfSiteId;
END;

DROP TRIGGER IF EXISTS UsageGroups_after_insert;
CREATE TRIGGER UsageGroups_after_insert
AFTER INSERT
   ON UsageGroups FOR EACH ROW
BEGIN
INSERT INTO radius.radgroupcheck (groupname,attribute,op) VALUES (NEW.GroupName,"Framed-Protocol",":=");
END;
