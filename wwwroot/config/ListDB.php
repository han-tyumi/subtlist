<?php
class ListDB {
	private $host = "***REMOVED***";
	private $dbname = "subtlist";
	private $username = "subtlist";
	private $password = "RoYal1704?";
	private $table = "list";
	private $conn;

	public function __construct() {
		$this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->username, $this->password);
	}

	public function create($title, $subtitle) {
		require_once("token.php");
		$key = getToken(10);
		$sql = "INSERT INTO `{$this->table}`(`id`, `title`, `subtitle`, `created`, `key`) VALUES (:id,:title,:subtitle,NOW(),:key";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_GET["id"], ":title" => $title, ":subtitle" => $subtitle, ":key" => $key))) {
			$_SESSION["key"] = $key;
			return true;
		} else {
			return false;
		}
	}

	public function read_one() {
		$sql = "SELECT `title`, `subtitle` FROM `{$this->table}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_GET["id"]))) {
			$data = $q->fetch(PDO::FETCH_ASSOC);
			return $data;
		} else {
			return false;
		}
	}

	public function update($title, $subtitle) {
		$sql = "UPDATE `{$this->table}` SET `title`=:title,`subtitle`=:subtitle WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":title" => $title, ":subtitle" => $subtitle, ":id" => $_GET["id"]))) {
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
