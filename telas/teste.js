
//ReservaUser?.map((item, index) => 
(<>
    <Card style={{ width: 0.9 * Dimensions.get('window').width, marginBottom: 15 }} key={index}>
        <Card.Content>
            <Title>{item.nome}</Title>
            <Card.Cover source={{ uri: item.urlImg }} style={{ width: 0.9 * Dimensions.get('window').width }} />
            <Paragraph>preço: R${parseFloat(item.preço).toFixed(2)}</Paragraph>
            <Paragraph>id: {userId}</Paragraph>
            <Paragraph>Inicio da reserva: {String(item.inicioReserva)}</Paragraph>
            <Paragraph>Fim da reserva: {String(item.fimReserva)}</Paragraph>

        </Card.Content>
        <Card.Actions>
            <IconButton icon="pencil" color="#4592a0" size={25} onPress={() => navigation.navigate("EditarReservaUser", { update: true, id: ids[index], obj: p })}></IconButton>
            <Button color='#d4161d' onPress={() => deletarItem(ids[index])}>Remover</Button>
        </Card.Actions>
    </Card>
</>)