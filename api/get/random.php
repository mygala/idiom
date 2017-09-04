<?php
/**
 * Created by PhpStorm.
 * User: HONOR
 * Date: 16/11/21
 * Time: 01:55
 */

    require_once(dirname(__FILE__) . "/../utils/runtime.php");

    if (isset($_REQUEST["number"]) && is_numeric($_REQUEST["number"]) && isset($_REQUEST["sign"]) && is_string($_REQUEST["sign"])) {

        /* 验证签名 开始 */
        require_once(dirname(__FILE__) . "/../auth/idiom.auth.class.php");

        $authString = strtolower("number=" . $_REQUEST["number"]);

        //var_dump(sha1(strtolower("number=" . $_REQUEST["number"]) . "&sks_" . strtolower("83DE535E7774DF82B2E0A4DF953D702F")));

        if (!IdiomAuth::authSign($authString, $_REQUEST["sign"])) {
            echo Output::r(7001);
            exit(0);
        }
        /* 验证签名 结束 */

        // 载入模块
        require_once(dirname(__FILE__) . "/../modules/get/get.class.php");

        $get = new Get();

        $params = array(
            "table" => "`idiom`",
            "dataArray" => array(
                "word", "error_word", "error_location"
            ),
            "condition" => "`error_word` != '' AND `error_location` != -1",
            "number" => $_REQUEST["number"]
        );

        $data = $get->randomRecord($params);

        echo Output::r(200, $data, false, isset($_REQUEST["callback"]) ? $_REQUEST["callback"] : "");

    } else {
        echo Output::r(2001, null, false, isset($_REQUEST["callback"]) ? $_REQUEST["callback"] : "");
    }