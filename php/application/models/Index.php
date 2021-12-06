<?php
require_once APPLICATION_ROOT_PATH . 'models/Base.php';

class Index extends Base{
    public function maplist(){
        return $this->_db->fetchAll("SELECT a.name as name,IFNULL(sum(state),0) as value,a.id as id FROM maplist a left join apply b ON a.id = b.province AND b.state = 1 GROUP BY a.id");
    }
}
?>