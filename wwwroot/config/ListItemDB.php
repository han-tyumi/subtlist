<?php
class ListItemDB {
	private $host = "***REMOVED***";
	private $dbname = "subtlist";
	private $username = "subtlist";
	private $password = "***REMOVED***";
	private $table = "list_item";
	private $conn;

	public function __construct() {
		$this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->username, $this->password);
	}

	public function create($item) {
		$sql = "INSERT INTO `{$this->table}`(`item`, `list_id`) VALUES (:item,:list_id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":item" => $item, ":list_id" => $_GET["id"]))) {
			return true;
		} else {
			return false;
		}
	}

	public function read() {
		$sql = "SELECT `id`, `item` FROM `{$this->table}` WHERE `list_id`=:list_id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":list_id" => $_GET["id"]))) {
			while ($row = $q->fetch(PDO::FETCH_ASSOC)) {
				$data[] = $row;
			}
			return $data;
		} else {
			return false;
		}
	}

	public function update($id, $item) {
		$sql = "UPDATE `{$this->table}` SET `item`=:item WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":item" => $item, ":id" => $id))) {
			return true;
		} else {
			return false;
		}
	}

	public function delete($id) {
		$sql = "DELETE FROM `{$this->table}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $id))) {
			return true;
		} else {
			return false;
		}
	}
}
?>
