<?php
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

class SubtlistDB
{
	// variables
	private $listTable = "list";
	private $itemTable = "list_item";
	private $conn;

	// initialize list database
	public function __construct()
	{
		$host = getenv("HOST");
		$dbname = getenv('DBNAME');
		$username = getenv('USERNAME');
		$password = getenv('PASSWORD');

		$this->conn = new PDO("mysql:host={$host};dbname={$dbname}", $username, $password);
		session_start();
	}

	// list functions

	// returns whether the list is able to be edited
	public function canEdit()
	{
		$sql = "SELECT `key` FROM `{$this->listTable}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"]))) {
			$key = $q->fetchColumn();
			if ($key) {
				if ($_COOKIE[$_SESSION["id"] . "rw"] == $key) {
					return true;
				}
			} elseif ($this->isNew()) {
				return true;
			}
			return false;
		} else {
			return false;
		}
	}

	// returns if new
	public function isNew()
	{
		$sql = "SELECT COUNT(*) FROM `{$this->listTable}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"]))) {
			if ($q->fetchColumn()) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	}

	// creates a new list
	public function createList($title, $subtitle)
	{
		require_once("token.php");
		$key = getToken(10);
		$sql = "INSERT INTO `{$this->listTable}`(`id`, `title`, `subtitle`, `created`, `key`) VALUES (:id,:title,:subtitle,NOW(),:key)";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"], ":title" => $title, ":subtitle" => $subtitle, ":key" => $key))) {
			setcookie($_SESSION["id"] . "rw", $key, time() + (31536000 * 5)); // Expires in 5 years
			return true;
		} else {
			return false;
		}
	}

	// returns the list's title and subtitle
	public function readList()
	{
		$sql = "SELECT `title`, `subtitle` FROM `{$this->listTable}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"]))) {
			$data = $q->fetch(PDO::FETCH_ASSOC);
			return $data;
		} else {
			return false;
		}
	}

	// updates the list's title and subtitle
	public function updateList($title, $subtitle)
	{
		if (!$this->canEdit()) {
			return false;
		}
		$sql = "UPDATE `{$this->listTable}` SET `title`=:title,`subtitle`=:subtitle WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":title" => $title, ":subtitle" => $subtitle, ":id" => $_SESSION["id"]))) {
			return true;
		} else {
			return false;
		}
	}

	// deletes a list
	public function deleteList()
	{
		if (!$this->canEdit()) {
			return false;
		}
		$sql = "DELETE FROM `{$this->listTable}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"]))) {
			return true;
		} else {
			return false;
		}
	}

	// list item functions

	// creates a new list item
	public function createItem($item, $order_index)
	{
		if (!$this->canEdit()) {
			return false;
		}
		$sql = "INSERT INTO `{$this->itemTable}`(`item`, `list_id`, `order_index`) VALUES (:item,:list_id,:order_index)";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":item" => $item, ":list_id" => $_SESSION["id"], ":order_index" => $order_index))) {
			return $this->conn->lastInsertId();
		} else {
			return false;
		}
	}

	// returns all list items for the current list
	public function readItem()
	{
		$sql = "SELECT `id`, `item`, `order_index` FROM `{$this->itemTable}` WHERE `list_id`=:list_id ORDER BY `order_index` ASC";
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

	// updates a specified list item
	public function updateItem($id, $item)
	{
		if (!$this->canEdit()) {
			return false;
		}
		$sql = "UPDATE `{$this->itemTable}` SET `item`=:item WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":item" => $item, ":id" => $id))) {
			return true;
		} else {
			return false;
		}
	}

	// updates an item's order index
	public function updateItemOrder($id, $order_index)
	{
		if (!$this->canEdit()) {
			return false;
		}
		$sql = "UPDATE `{$this->itemTable}` SET `order_index`=:order_index WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":order_index" => $order_index, ":id" => $id))) {
			return true;
		} else {
			return false;
		}
	}

	// deletes a specified list item
	public function deleteItem($id)
	{
		if (!$this->canEdit()) {
			return false;
		}
		$sql = "DELETE FROM `{$this->itemTable}` WHERE `id`=:id";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $id))) {
			return true;
		} else {
			return false;
		}
	}

	// creates a key cookie if the correct key is supplied
	public function tryKey($key)
	{
		$sql = "SELECT COUNT(*) FROM `{$this->listTable}` WHERE `id`=:id AND `key`=:key";
		$q = $this->conn->prepare($sql);
		if ($q->execute(array(":id" => $_SESSION["id"], ":key" => $key))) {
			if ($q->fetchColumn()) {
				setcookie($_SESSION["id"] . "rw", $key, time() + (31536000 * 5));
				return true;
			} else {
				return false;
			}
		}
		return false;
	}
}
