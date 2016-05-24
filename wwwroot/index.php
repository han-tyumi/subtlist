<?php
function crypto_rand_secure($min, $max) {
    $range = $max - $min;

    if ($range < 1) return $min;

    $log = ceil(log($range, 2));
    $bytes = (int) ($log / 8) + 1;
    $bits = (int) $log + 1;
    $filter = (int) (1 << $bits) - 1;

    do {
        $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
        $rnd = $rnd & $filter;
    } while ($rnd >= $range);

    return $min + $rnd;
}

function getToken($length) {
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet .= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet .= "0123456789";
    $max = strlen($codeAlphabet) - 1;

    for ($i=0; $i < $length; $i++) {
        $token .= $codeAlphabet[crypto_rand_secure(0, $max)];
    }

    return $token;
}

if (!isset($_GET["id"])) {
	header("Location: ./" . getToken(10));
	exit;
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
	<body>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
					<a class="navbar-brand" href="#">Subtlist</a>
				</div>
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li><a href=".">New</a></li>
						<li><a href="#">Read-Only</a></li>
					</ul>
				</div>
			</div>
		</nav>
		<div class="container" ng-controller="main">
			<!-- Read-only panel -->
			<div id="view" class="panel panel-default">
				<div class="panel-heading">
					<h1 class="panel-title">{{title}} [{{numDone}}/{{list.length}}]<br/><small>{{subtitle}}</small></h1>
				</div>
				<div class="panel-body" ng-show="list.length > 0">
					<div class="progress">
						<div id="progress-bar" class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="{{progress}}" aria-valuemin="0" aria-valuemax="100">
							{{progress.toFixed(0)}}%
						</div>
					</div>
				</div>
				<ul class="list-group">
					<button type="button" class="list-group-item" ng-click="toggle($index)" ng-class="{'list-group-item-success': item.done}" ng-repeat="item in list">
						<span ng-class="{'glyphicon glyphicon-ok-circle': !item.done, 'glyphicon glyphicon-ok-sign': item.done}"></span>
						<span ng-class="{done: item.done}"><b>{{item.name}}</b></span>
					</button>
				</ul>
			</div>

			<!-- Edit panel -->
			<div id="edit" class="panel panel-default">
				<div class="panel-heading">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="Title" ng-model="title">
					</div>
					<input type="text" class="form-control" placeholder="Subtitle" ng-model="subtitle">
				</div>
				<ul class="list-group">
					<li class="list-group-item" ng-repeat="item in list">
						<div class="input-group">
							<input type="text" class="form-control" ng-model="item.name">
							<span class="input-group-btn">
								<button class="btn btn-danger" type="button" ng-click="remove($index)">
									<span class="glyphicon glyphicon-remove"></span>
								</button>
							</span>
						</div>
					</li>
				</ul>
				<div class="panel-footer">
					<form class="input-group" ng-submit="addItem()">
						<input type="text" class="form-control" placeholder="Item" ng-model="input">
						<span class="input-group-btn">
							<button class="btn btn-success" type="submit">
								<span class="glyphicon glyphicon-plus"></span>
							</button>
						</span>
					</form>
				</div>
			</div>
		</div>
		<script src="lib/js/jquery-1.12.0.min.js"></script>
		<script src="lib/js/bootstrap.min.js"></script>
		<script src="lib/js/angular.min.js"></script>
		<script src="lib/js/angular-cookies.min.js"></script>
		<script src="js/subtlist.js"></script>
	</body>
</html>
