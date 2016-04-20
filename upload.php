<?php

header('Access-Control-Allow-Origin: *');

$db = mysql_connect("localhost","cloonemy_fazrin","root_123") or die('Could not connect: ' . mysql_error());
	mysql_query("SET character_set_results=utf8", $db);
	mb_language('uni');
	mb_internal_encoding('UTF-8');
	mysql_select_db("cloonemy_supplier2" , $db);
	mysql_query("set names 'utf8'",$db);




$uploadfilename = $_FILES['file']['tmp_name'];
move_uploaded_file($uploadfilename, '../images/tvform_appeal'.$_FILES['file']['name'])





?>
