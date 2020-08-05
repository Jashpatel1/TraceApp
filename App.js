import React,{Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList , StatusBar, TouchableOpacity} from 'react-native';

export default class App extends Component {
  state = { product: '' , traceArray : [], isLoggedIn : true , viewTrace : false};

    updateProduct = event =>{
        this.setState({ product : event.target.value});
    }

    traceProduct = () => {
      this.setState({ viewTrace : false });

      const { product } = this.state;

        fetch('https://vast-thicket-16737.herokuapp.com/api/trace', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({product})
        }).then(response => response.json())
        .then(json => this.setState({ traceArray: json.traceArray}));

        this.setState({ viewTrace : true });
    }

  itemDisplay = (item , index) => {
    return (
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:18}}>{item}</Text>
        {index !== this.state.traceArray.length-1 && 
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text>|</Text>
          <Text>↓</Text>
        </View> }
      </View>
    );
  }

  render(){
    console.log(this.state.traceArray);
    return (
      <View style={{ flex:1 , marginTop: StatusBar.currentHeight}}>

        <View style={{ height: 50, backgroundColor:"#000", alignItems:'center', justifyContent:'center'}}>
          <Text style={{fontSize:20, color:'#eee', fontWeight:'bold' }}>Trace a Product</Text>
        </View>

        <View style={{ flex:1, marginTop:30 }}>
          <Text style={{ paddingHorizontal: 20, fontSize: 18 , fontWeight:'bold'}}>Enter Product Name -</Text>
          <TextInput
            style={{
              marginHorizontal: 20,
              paddingHorizontal: 20,
              height: 50,
              borderColor:'#0d0d0d',
              borderWidth:0.4,
              borderRadius : 20,
              marginVertical: 10
            }}
            placeholder="Product to be traced"
            value={this.state.product}
            onChange={this.updateProduct}
          />

          <TouchableOpacity
            style={{
              alignItems:'center',
              justifyContent:'center',
              marginTop:10
            }}
            onPress={this.traceProduct}
          >
            <View style={{
              width:100,
              height:50,
              borderColor:'#c4c4c4',
              borderWidth:0.2,
              borderRadius:10,
              alignItems:'center',
              justifyContent:'center',
              backgroundColor: '#0091D3'
            }}>
              <Text style={{fontSize:15, color:'#eee', fontWeight:"400"}}>TRACE</Text>
            </View>
          </TouchableOpacity>

          {/* <Button title="Trace" onPress={this.traceProduct}></Button> */}
          { this.state.viewTrace && 
          <View style={styles.container}>
            <FlatList
              data = {this.state.traceArray}
              renderItem = {({item,index}) => this.itemDisplay(item, index)}
              keyExtractor = {(item, index) => index.toString()}
              ListEmptyComponent={
                <View>
                  <Text style={{fontSize:18 }}>
                    No details for the product found.
                  </Text>
                </View>
              }
            />
          </View> }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:20
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold"
  }
});
