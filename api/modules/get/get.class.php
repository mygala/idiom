<?php

    require_once(dirname(__FILE__) . "/../../core/class/database/database.class.php");

    class Get extends DataBase {

        function __construct() {
            parent::__construct();
        }

        function __destruct() {
            parent::__destruct();
        }

        public function randomRecord($params) {

            $result = array();

            // 获取可用记录总数
            $query = parent::query("SELECT COUNT(`word`) AS `count` FROM " . $params["table"] . " WHERE 1=1" . (!empty($params["condition"]) ? " AND (" . $params["condition"] . ")" : ""));
            $count = @mysqli_fetch_array($query, MYSQLI_ASSOC)["count"];

            // 确保获取number不超过记录总数
            $params["number"] = ($count < $params["number"]) ? (int)$count : (int)$params["number"];

            // 已获得随机数临时数组，防止重复获取
            $tempRand = array();

            // 随机抽取number条记录
            for ($i = 0; $i < $params["number"]; $i++) {

                // 生成随机数
                while (true) {
                    $rd = (int)rand(0, $count - 1);

                    if (in_array($rd, $tempRand)) {
                        continue;
                    } else {
                        $tempRand[] = $rd;
                        break;
                    }
                }

                $params["limit"] = $rd . ", 1";
                $result[] = parent::get($params["table"], $params["dataArray"], $params["condition"], $params["limit"])[0];
            }

            return count($result) > 0 ? $result : null;
        }

    }
