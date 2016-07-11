<?php
include_once "config/ListItemDB.php";

$db = new ListItemDB();
$data = json_decode(file_get_contents("php://input"));

if (isset($data->create)) {
	if ($db->create($data->item, $data->order_index)) {
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
} elseif (isset($data->update)) {
	if ($db->update($data->id, $data->item)) {
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
