import React, { useState, useEffect } from 'react'
import { Image, View, Text, Modal, Button, StyleSheet, ActivityIndicator } from 'react-native'
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import axios from 'axios'

export default app = () => {
  const [scannedImage, setScannedImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [predictions, setPredictions] = useState([]);

  const [isLoading, setIsLoading] = useState(false);


  const Card = ({ title, content }) => {
    return (
      <View style={styles.card}>
        <View>
          <Text>{'title'}</Text>
          <Text>{'value'}</Text>
        </View>
        <View>
          <Text>{'title'}</Text>
        </View>
        <View>
          <Text>{'title'}</Text>
          <Text>{'value'}</Text>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },


  });



  useEffect(() => {
    // call scanDocument on load
    scanDocument();
  }, []);


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 100,
      responseType: ResponseType.Base64,
      maxNumDocuments: 1,
      letUserAdjustCrop: true
    })

    //  console.log('scannedImages', scannedImages);
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
      processImage(scannedImages[0])
    }
  }

  const processImage = async (img) => {
    let body = {
      "board_name": "Mumbai Divisional Board",
      "exam_type": "Higher Secondary Certificate Examination",
      "stream": "Commerce",
      "examination_year": "2018",
      "image": img
    }

    try {
      setIsLoading(true);
      let response = await axios.post("http://localhost:3000/data", body);
      console.log('resp', response.data.data);
      setPredictions(response.data.data);
      toggleModal();
      setIsLoading(false);
    } catch (e) {
      console.log('err', e);
      setIsLoading(false);
    }
  }

  const tableStyles = StyleSheet.create({
    headerText: {
      color: '#052C3C',
      fontFamily: 'fira sans',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
      height: 17,
      marginTop: 10,
      marginBottom: 30
    },
    table: {
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dotted",
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    cell: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dashed",
      textAlign: "center",
      fontSize: 10,
      color: "black",
      fontFamily: 'Fira Sans',
      fontWeight: '500'
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      borderColor: '#CDD8DD',
      borderWidth: 1,
      borderStyle: 'dashed',
      color: '#052C3C',
      fontFamily: 'Fira Sans',
      fontSize: 10,
    }
  });

  const Table = () => {
    return (
      <>
        <View>
          <Text style={tableStyles.headerText}>{'Mumbai Divisional Board'.toUpperCase()}</Text>
        </View>
        <View style={tableStyles.table}>
          {predictions.map((data, index) => (
            <View style={tableStyles.row} key={`${index}-prediction`}>
              <Text style={tableStyles.cell}>{data.tag.toUpperCase()} </Text>
              <Text style={tableStyles.cell}> {data.text} </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const loaderStyle = StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ddd'
    }
  });


  return (
    isLoading ? (
      <View style={loaderStyle.centered}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    ) : (

      <View>
        <Image
          resizeMode="contain"
          style={{ width: '100%', height: '80%' }}
          source={{ uri: `data:image/jpeg;base64,${scannedImage}` }}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >
          <View style={tableStyles.container}>
            <Table />
          </View>

          <View style={tableStyles.container}>
            <Card />

          </View>

        </Modal>
      </View>
    ))
}
