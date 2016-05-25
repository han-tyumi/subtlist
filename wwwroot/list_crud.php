<?php
include_once "config/ListDB.php";

$db = new ListDB();
$data = json_decode(file_get_contents("php://input"));

if (isset($data->create)) {
	if ($db->create($data->date, $data->top_clicks, $data->bottom_clicks, $data->ip)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->read_all)) {
	$data = $db->read_all();
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->read_one)) {
	$data = $db->read_one($data->id);
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->update)) {
	if ($db->update($data->date, $data->top_clicks, $data->bottom_clicks, $data->ip)) {
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
