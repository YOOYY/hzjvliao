<?php
require_once APPLICATION_ROOT_PATH . 'models/Admin.php';
require_once APPLICATION_ROOT_PATH . 'models/Util.php';
/**
 * 后台管理主页
 * @package admin
 */
class AdminController extends Front_Controller_Action {

    public function preDispatch() {
        $this->_admin = new Admin();
        $this->_util = new Util();
    }

    public function indexAction() {
        $this->render('index');
    }

    //管理员登陆后台
    public function loginAction() {
        $req = json_decode(file_get_contents('php://input'),true);
        $name = $req['name'];
        $password = $req['password'];
        try {
            $res = $this->_admin->login($name,$password);
            $res = ['error'=>0,'data'=>$res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function adminlistAction() {
        try {
            $res = $this->_admin->select('fetchAll','adminuser',array('col'=>'id,name,nickname'));
            $res = ['error'=>0,'data'=>$res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function listAction() {
        try {
            $type = $_GET['type'];
            $res = $this->_admin->select('fetchAll',$type);
            $res = ['error'=>0,'data'=>$res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function mapAction()
    {
        try {
            $type = $_GET['type'];
            $res = $this->_admin->select('fetchPairs', $type);
            $res = ['error' => 0, 'data' => $res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function createAction() {
        $req = json_decode(file_get_contents('php://input'),true);
        if(isset($req['password'])){
            $req['password'] = $this->_admin->_encrypt($req['password']);
        }
        $type = $req['type'];
        unset($req['type']);
        try {
            $id = $this->_admin->insert($type,$req);
            if(!isset($req["id"])){
                $req["id"] = $id;
            }
            unset($req['password']);
            $res = ['error'=>0,'data'=>$req];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    //单行更新
    public function updateAction() {
        $req = json_decode(file_get_contents('php://input'),true);
        if(isset($req['password'])){
            $req['password'] = $this->_admin->_encrypt($req['password']);
        }
        $type = $req['type'];
        unset($req['type']);
        $where = array('id = ?',$req['id']);
        try {
            $this->_admin->update($type,$req,$where);
            $res = ['error'=>0,'data'=> $req];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function deleteAction() {
        $req = json_decode(file_get_contents('php://input'),true);
        $type = $req['type'];
        $where = array('id = ?',$req['id']);
        try {
            $res = $this->_admin->delete($type,$where);
            $res = ['error'=>0,'data'=>$res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }

    public function uploadfileAction() {
        try {
            $res = $this->_admin->upfiles($_FILES,$_POST);
            $res = ['error'=>0,'data'=>$res];
        } catch (Exception $e) {
            $res = $this->_util->err($e);
        }
        echo json_encode($res);
    }
}
