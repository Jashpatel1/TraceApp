import React,{Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList , StatusBar, TouchableOpacity} from 'react-native';
import Timeline from 'react-native-timeline-flatlist'

export default class App extends Component {
  state = { product: '' , traceArray : [], isLoggedIn : true , viewTrace : false, isLoading : false, userArray: [], data : []};

    traceProduct = async () => {
      this.setState({ viewTrace : false, isLoading:true });

      const { product } = this.state;

      let traceArray = [];
      try {
        await fetch('https://vast-thicket-16737.herokuapp.com/api/trace',{
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              product : this.state.product
            })
        }).then((response) => response.json())
        .then((json) => {
          traceArray = json.traceArray;
          // console.log("traceArray");
          // console.log(json.traceArray);
          this.setState({ traceArray: json.traceArray});
        });
      }catch(error){
        console.log(error);
      }
        
        this.getAddress(traceArray);
        // this.setState({ viewTrace : true, isLoading:false });
    }
  
  getAddress = async (traceArray) => {
      let userArray = [];
      for (let i in traceArray){
        await fetch('https://vast-thicket-16737.herokuapp.com/api/user/getUser', {
            method: 'POST',
            headers: { 'Content-Type' : 'application/json' },
            body: JSON.stringify({address : traceArray[i]})
        }).then(response => response.json())
        .then(json => {
          console.log(json.user.name);
          userArray.push(json.user);
        });
      }

      this.set(userArray);
    }

    set = (userArray) => {
      let data = [];
      for(let i in userArray){
        const ele = {
          title : userArray[i].name,
          description : "Address - " + userArray[i].address.substring(0,15) + "....\n" +
                        "Phone - " + userArray[i].phone + "\n"
        }
        data.push(ele);
      }
      this.setState({ userArray : userArray , viewTrace : true, isLoading:false, data : data })
    }

    itemDisplay = (item , index) => {
    return (
      <View style={{justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:18, paddingHorizontal : 20}}>Name - {item.name}</Text>
        <Text style={{fontSize:18, paddingHorizontal : 20}}>Phone - {item.phone}</Text>
        <Text style={{fontSize:18, paddingHorizontal : 20}}>Address - {item.address.substring(0,15)}....</Text>
        {index !== this.state.userArray.length-1 && 
        <View style={{justifyContent:'center', alignItems:'center'}}>
          <Text>|</Text>
          <Text>↓</Text>
        </View> }
      </View>
    );
  }

  render(){
    // console.log(this.state.product);
    // console.log(this.state.traceArray);
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
            onChangeText={(text) => this.setState({ product: text })}
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

          {this.state.isLoading &&
          <View style={{alignItems:'center', justifyContent : 'center', marginTop:20 }}>
            <Text style={{fontSize:18}}>Loading ....</Text>
          </View>}

          <Text>{"\n"}</Text>
          {this.state.viewTrace && 
          <Timeline
            data={this.state.data}
            circleSize={23}
            lineColor='rgb(45,156,219)'
          />}
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
