<?php
include_once "config/ListDB.php";

$db = new ListDB();
$data = json_decode(file_get_contents("php://input"));

if (isset($data->create)) {
	$data = $db->create($data->title, $data->subtitle);
	if ($data) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->read)) {
	$data = $db->read();
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->can_edit)) {
	if ($db->can_edit()) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->update)) {
	if ($db->update($data->title, $data->subtitle)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->delete)) {
	if ($db->delete()) {
		echo "success";
	} else {
		echo "failure";
	}
} else {
	echo "failure";
}
?>
