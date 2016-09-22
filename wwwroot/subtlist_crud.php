<?php
include_once "config/SubtlistDB.php";

$db = new SubtlistDB();
$data = json_decode(file_get_contents("php://input"));

if (isset($data->canEdit)) {
	if ($db->canEdit()) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->isNew)) {
	if ($db->isNew()) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->createList)) {
	if ($db->createList($data->title, $data->subtitle)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->readList)) {
	$data = $db->readList();
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->updateList)) {
	if ($db->updateList($data->title, $data->subtitle)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->deleteList)) {
	if ($db->deleteList()) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->createItem)) {
	$data = $db->createItem($data->item, $data->order_index);
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->readItem)) {
	$data = $db->readItem();
	if ($data) {
		echo json_encode($data);
	} else {
		echo "failure";
	}
} elseif (isset($data->updateItem)) {
	if ($db->updateItem($data->id, $data->item)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->updateItemOrder)) {
	if ($db->updateItemOrder($data->id, $data->order_index)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->deleteItem)) {
	if ($db->deleteItem($data->id)) {
		echo "success";
	} else {
		echo "failure";
	}
} elseif (isset($data->tryKey)) {
	if ($db->tryKey($data->key)) {
		echo "success";
	} else {
		echo "failure";
	}
} else {
	echo "failure";
}
?>
