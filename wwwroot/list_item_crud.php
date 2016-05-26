<?php
include_once "config/ListItemDB.php";

$db = new ListItemDB();
$data = json_decode(file_get_contents("php://input"));

if (isset($data->create)) {
	$data = $db->create($data->title, $data->subtitle);
	if ($data) {
		echo json_encode($data);
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
	$data = $db->can_edit($data->key);
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->update)) {
	if ($db->update($data->title, $data->subtitle, $data->key)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->delete)) {
	if ($db->delete($data->id)) {
		echo "success";
	} else {
		echo "failure";
	}
} else {
	echo "failure";
}
?>
