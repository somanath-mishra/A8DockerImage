DROP TRIGGER IF EXISTS radacct_before_update; 
CREATE TRIGGER radacct_before_update 
BEFORE UPDATE ON radacct
FOR EACH ROW 
Begin
      declare prevupbandwidth bigint;
      declare prevdownbandwidth bigint;
         
 	  set prevupbandwidth = ABS(New.acctinputoctets-Old.acctinputoctets);
   	  set prevdownbandwidth = ABS(New.acctoutputoctets-Old.acctoutputoctets);
         
        #Insert into radacct_Update_As_Per_Hour(startdatetime,hours,acctupbandwidth,acctdownbandwidth,lastPacketRecieveTime,lastPacketUpRecieveValueBefore,lastPacketUpRecieveValueAfter,lastPacketDownRecieveValueBefore,lastPacketDownRecieveValueAfter) values(Now(),hour(Now()),(New.acctinputoctets-Old.acctinputoctets),(New.acctoutputoctets-Old.acctoutputoctets),Now(),Old.acctinputoctets,New.acctinputoctets,Old.acctoutputoctets,New.acctoutputoctets);
       IF NOT EXISTS (SELECT radacctid from radacct_Update_As_Per_Hour where hours=hour(Now()) and date(startdatetime)=date(Now())) then
          Insert into radacct_Update_As_Per_Hour(startdatetime,hours,acctupbandwidth,acctdownbandwidth,lastPacketRecieveTime,lastPacketUpRecieveValueBefore,lastPacketUpRecieveValueAfter,lastPacketDownRecieveValueBefore,lastPacketDownRecieveValueAfter,NoOfActiveSession,nasipaddress) 
          values(Now(),hour(Now()),prevupbandwidth,prevdownbandwidth,Now(),Old.acctinputoctets,prevupbandwidth,Old.acctoutputoctets,prevdownbandwidth,(select count(radacctid) from radius.radacct where acctstoptime Is null),Old.nasipaddress);
        	#Update the new row if exist in 
 	   ELSE
     	SET SQL_SAFE_UPDATES=0;
        	UPDATE radacct_Update_As_Per_Hour
        	SET acctupbandwidth=acctupbandwidth+prevupbandwidth,acctdownbandwidth=acctdownbandwidth+prevdownbandwidth,
        	lastPacketRecieveTime=Now(),lastPacketUpRecieveValueBefore=OLD.acctinputoctets,lastPacketUpRecieveValueAfter=New.acctinputoctets,
        	lastPacketDownRecieveValueBefore=Old.acctoutputoctets,lastPacketDownRecieveValueAfter=New.acctoutputoctets,NoOfActiveSession=(select count(radacctid) from radius.radacct where acctstoptime Is Null)
        	where date(radacct_Update_As_Per_Hour.startdatetime)=date(Now()) and radacct_Update_As_Per_Hour.hours=hour(Now()) ;
        END IF;
END;

DROP TRIGGER IF EXISTS radacct_after_update; 
CREATE TRIGGER radacct_after_update 
BEFORE UPDATE ON radacct
FOR EACH ROW 
Begin
      declare prevupbandwidth bigint;
      declare prevdownbandwidth bigint;
         
 	  set prevupbandwidth = ABS(New.acctinputoctets-Old.acctinputoctets);
   	  set prevdownbandwidth = ABS(New.acctoutputoctets-Old.acctoutputoctets);
         
        #Insert into radacct_Update_As_Per_Hour(startdatetime,hours,acctupbandwidth,acctdownbandwidth,lastPacketRecieveTime,lastPacketUpRecieveValueBefore,lastPacketUpRecieveValueAfter,lastPacketDownRecieveValueBefore,lastPacketDownRecieveValueAfter) values(Now(),hour(Now()),(New.acctinputoctets-Old.acctinputoctets),(New.acctoutputoctets-Old.acctoutputoctets),Now(),Old.acctinputoctets,New.acctinputoctets,Old.acctoutputoctets,New.acctoutputoctets);
       IF NOT EXISTS (SELECT radacctid from radacct_Update_As_Per_Hour where hours=hour(Now()) and date(startdatetime)=date(Now())) then
          Insert into radacct_Update_As_Per_Hour(startdatetime,hours,acctupbandwidth,acctdownbandwidth,lastPacketRecieveTime,lastPacketUpRecieveValueBefore,lastPacketUpRecieveValueAfter,lastPacketDownRecieveValueBefore,lastPacketDownRecieveValueAfter,NoOfActiveSession,nasipaddress) 
          values(Now(),hour(Now()),prevupbandwidth,prevdownbandwidth,Now(),Old.acctinputoctets,prevupbandwidth,Old.acctoutputoctets,prevdownbandwidth,(select count(radacctid) from radius.radacct where acctstoptime Is null),Old.nasipaddress);
        	#Update the new row if exist in 
 	   ELSE
     	SET SQL_SAFE_UPDATES=0;
        	UPDATE radacct_Update_As_Per_Hour
        	SET acctupbandwidth=acctupbandwidth+prevupbandwidth,acctdownbandwidth=acctdownbandwidth+prevdownbandwidth,
        	lastPacketRecieveTime=Now(),lastPacketUpRecieveValueBefore=OLD.acctinputoctets,lastPacketUpRecieveValueAfter=New.acctinputoctets,
        	lastPacketDownRecieveValueBefore=Old.acctoutputoctets,lastPacketDownRecieveValueAfter=New.acctoutputoctets,NoOfActiveSession=(select count(radacctid) from radius.radacct where acctstoptime Is Null)
        	where date(radacct_Update_As_Per_Hour.startdatetime)=date(Now()) and radacct_Update_As_Per_Hour.hours=hour(Now()) ;
        	END IF;
END;


CREATE TABLE IF NOT EXISTS `radacct_Update_As_Per_Hour` (
  `radacctid` bigint(21) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(300) DEFAULT NULL,
  `startdatetime` datetime DEFAULT NULL,
  `hours` int(11) DEFAULT '0',
  `acctupbandwidth` bigint(20) DEFAULT '0',
  `acctdownbandwidth` bigint(20) DEFAULT '0',
  `lastPacketRecieveTime` datetime DEFAULT NULL,
  `lastPacketUpRecieveValueBefore` bigint(20) DEFAULT '0',
  `lastPacketUpRecieveValueAfter` bigint(20) DEFAULT '0',
  `lastPacketDownRecieveValueBefore` bigint(20) DEFAULT '0',
  `lastPacketDownRecieveValueAfter` bigint(20) DEFAULT '0',
  `NoOfActiveSession` int(11) DEFAULT '0',
  `nasipaddress` varchar(15) NOT NULL DEFAULT '',
  PRIMARY KEY (`radacctid`)
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=latin1;
