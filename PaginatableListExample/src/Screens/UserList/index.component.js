import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import PaginatableList from '@twotalltotems/paginatable-list';
import style from './style';

const ttt_blue = '#5B93C3'
const ttt_white = '#FFFFFF'
const ttt_grey = '#4D4D4F'

export default class UserListComponent extends Component {

    constructor(props){
        super(props)
    }

    state = {
        highlightedItemIndex: null
    }

    renderListItem = ({ index, item }) => {
        const isHighlighted = index == this.state.highlightedItemIndex
        return (
            <TouchableOpacity
                style={{ ...style.cellButton, backgroundColor: isHighlighted ? ttt_blue : undefined }}
                onPress={() => {
                    this.setState({
                        highlightedItemIndex: index
                    })
                    if (this.props.onHighlightItem) {
                        this.props.onHighlightItem(index)
                    }   
                }}
            >
                <Image style={style.cellLogo} resizeMode={'contain'} source={isHighlighted ? require('../../Assets/TTTLogo_white.png') : require('../../Assets/TTTLogo.png')} />
                <Text style={{ color: isHighlighted ? ttt_white : ttt_grey, fontWeight: isHighlighted ? 'bold' : 'normal' }}>User ID: {item.id}</Text>
                <Text style={{ color: isHighlighted ? ttt_white : ttt_grey, fontWeight: isHighlighted ? 'bold' : 'normal' }}>Email: {item.email}</Text>
                
            </TouchableOpacity>
        )
    }

    renderEmptyStatus = () => {
        return (
            <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <Image style={style.emptyStatusLogo} resizeMode={'contain'} source={require('../../Assets/TTTLogo.png')} />
                    <Text>Customized Empty Status</Text>
                </View>
            </View>
        )
    }

    onPaginatableListLoadError = (error) => {
        const { status } = error.request
        if (status == 0) {
            alert('It seems like your local server is not running properly. \nPlease Check README.md for more details.')
        }
    }

    render() {
        return (
            <View style={{ flex:1 }}>
                <PaginatableList
                    onRenderItem={this.renderListItem}
                    onRenderEmptyStatus={this.renderEmptyStatus}
                    customizedPaginationStateManager={this.props.paginatableListReducer}
                    extraData={this.state.highlightedItemIndex}
                    // pageSize={10}
                    // pageSizeKey={'size'}
                    // pageNumberKey={'page'}
                    // onLoadMore={this.props.onLoadMore}
                    // onRefresh={this.props.onRefresh}
                    onLoadError={this.onPaginatableListLoadError}
                />
            </View>
        )
    }
}