/* eslint-disable react/prop-types */

import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function ModalAddHangDoi(props) {
  const { handleClose, show, setTerm, dataSP, convertToCurrency, handleDetail } = props;

  return (
    <div>
      <Modal style={{ paddingTop: 90, marginLeft: 150 }} show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chọn sản phẩm đổi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TextField style={{ width: '100%' }} label="Nhập tên sản phẩm" variant="outlined" onChange={(e) => setTerm(e.target.value)} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableBody>
                {dataSP ? (
                  dataSP.map((d, i) => (
                    <TableRow
                      key={i}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDetail(d.sanPham.id)}
                    >
                      <TableCell component="th" scope="row" className="d-flex">
                        <img
                          src={`http://localhost:8080/api/chi-tiet-san-pham/${d.id}`}
                          className="img-history rounded-start me-3"
                          alt=""
                          width={70}
                          height={150}
                          style={{ borderRadius: 15 }}
                        />
                        {d.sanPham.ten}
                      </TableCell>
                      <TableCell align="right">{d.soLuong}</TableCell>
                      <TableCell align="right">{convertToCurrency(d.giaBan)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell align="right">CC</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ModalAddHangDoi;