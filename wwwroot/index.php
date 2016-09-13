<?php
session_start();
require_once("token.php");
if (!isset($_GET["id"])) {
	header("Location: ./" . getToken(10));
	exit;
} else {
	$_SESSION["id"] = $_GET["id"];
}
?>

<!DOCTYPE html>
<html lang="en" ng-app="subtlist">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Subtlist</title>
		<link rel="stylesheet" href="lib/css/bootstrap.min.css">
		<link rel="stylesheet" href="lib/css/bootstrap-theme.min.css">
		<link rel="stylesheet" href="css/style.css">
		<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->
	</head>
	<body ng-controller="mainController">
		<!-- Navbar -->
		<nav class="navbar navbar-default navbar-fixed-top">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href=".">Subtlist</a>
				</div>
				<div class="collapse navbar-collapse" id="navbar-collapse">
					<ul class="nav navbar-nav">
						<li><a href=".">New</a></li>
						<li><a href="#view">View</a></li>
						<li ng-if="list.canEdit.value"><a href="#edit">Edit</a></li>
					</ul>
				</div>
			</div>
		</nav>
		<div class="container">
			<div ng-view></div>
		</div>
		<script src="lib/js/jquery-1.12.0.min.js"></script>
		<script src="lib/js/bootstrap.min.js"></script>
		<script src="lib/js/angular.min.js"></script>
		<script src="lib/js/angular-route.min.js"></script>
		<script src="lib/js/angular-cookies.min.js"></script>
		<script src="js/subtlist.js"></script>
	</body>
</html>
