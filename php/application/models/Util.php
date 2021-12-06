<?php
 class Util {
    function err($e){
        //记录日志
        $content = date('Y-m-d H:i:s').":\t";
        $content.= $e->getMessage()."\t";
        $content.= $e->getFile()." on line ".$e->getLine()."\t";
        $content.= $e->getTraceAsString()."\t";
        require_once APPLICATION_ROOT_PATH . 'models/Logs.php';
        Logs::write('exception', $content);
        return $e->getMessage();
    }
}