<?php
class ListDB {
	private $host = "***REMOVED***";
	private $dbname = "subtlist";
	private $username = "subtlist";
	private $password = "***REMOVED***";
	private $table = "list";
	private $conn;

	public function __construct() {
		$this->conn = new PDO("mysql:host={$this->host};dbname={$this->dbname}", $this->username, $this->password);
		session_start();
	}

	public function create($title, $subtitle) {
		require_once("token.php");
		$key = getToken(10);
		$sql = "INSERT INTO `{$this->table}`(`id`, `title`, `subtitle`, `created`, `key`) VALUES (:id,:title,:subtitle,NOW(),:key)";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"], ":title" => $title, ":subtitle" => $subtitle, ":key" => $key))) {
			setcookie($_SESSION["id"] . "rw", $key, time() + (31536000 * 5)); // Expires in 5 years
			return true;
		} else {
			return false;
		}
	}

	public function read() {
		$sql = "SELECT `title`, `subtitle` FROM `{$this->table}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"]))) {
			$data = $q->fetch(PDO::FETCH_ASSOC);
			return $data;
		} else {
			return false;
		}
	}

	public function can_edit() {
		$sql = "SELECT EXISTS(SELECT 1 FROM `{$this->table}` WHERE `id`=:id AND `key`=:key)";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"], ":key" => $_COOKIE[$_SESSION["id"] . "rw"]))) {
			if ($q->rowCount() > 0) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function update($title, $subtitle) {
		if ($this->can_edit()) {
			$sql = "UPDATE `{$this->table}` SET `title`=:title,`subtitle`=:subtitle WHERE `id`=:id";
			$q = $this->conn->prepare($sql);
			if ($q->execute(array(":title" => $title, ":subtitle" => $subtitle, ":id" => $_SESSION["id"]))) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	public function delete() {
		$sql = "DELETE FROM `{$this->table}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"]))) {
			return true;
		} else {
			return false;
		}
	}
}
?>
