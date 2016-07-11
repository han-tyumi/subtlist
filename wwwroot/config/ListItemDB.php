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
		session_start();
	}

	public function create($item, $order_index) {
		$sql = "INSERT INTO `{$this->table}`(`item`, `list_id`, `order_index`) VALUES (:item,:list_id,:order_index)";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":item" => $item, ":list_id" => $_SESSION["id"], ":order_index" => $order_index))) {
			return true;
		} else {
			return false;
		}
	}

	public function read() {
		$sql = "SELECT `id`, `item`, `order_index` FROM `{$this->table}` WHERE `list_id`=:list_id ORDER BY `order_index` ASC";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":list_id" => $_SESSION["id"]))) {
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
